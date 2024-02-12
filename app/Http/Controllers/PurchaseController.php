<?php

namespace App\Http\Controllers;

use App\Exports\AdminQuotesExport;
use App\Http\Requests\CreatePurchaseRequest;
use App\Http\Requests\CreateQuoteRequest;
use App\Http\Requests\UpdatePurchaseRequest;
use App\Http\Requests\UpdateQuoteRequest;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\ManageStock;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Setting;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Repositories\PurchaseRepository;
use App\Repositories\QuoteRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laracasts\Flash\Flash;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class PurchaseController extends AppBaseController
{
    /** @var PurchaseRepository */
    private $purchaseRepository;

    public function __construct(PurchaseRepository $purchaseRepository)
    {
        $this->purchaseRepository = $purchaseRepository;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): Factory|View|Application
    {
        

        return view('purchases.index');
    }

    public function create(): View|Factory|Application
    {

        return view('purchases.create')->with($this->getFormParams());
    }

    /**
     * purchase form data
     * @param $purchase
     * @return array
     */
    public function getFormParams($purchase = null)
    {

        $warehouses = Warehouse::toBase()->pluck('name', 'id')->toArray();
        $suppliers = Supplier::toBase()->pluck('name', 'id')->toArray();

        return [
            'warehouses' => $warehouses,
            'suppliers' => $suppliers,
            'product_statuses' => Purchase::OrderStatusses,
            'purchase' => ($purchase ?? (new Purchase())),
            'tax_types' => Purchase::TaxTypes,
            'discount_types' => Purchase::DiscountTypes,
        ];
    }

    public function store(CreatePurchaseRequest $request): mixed
    {
        try {
            $input = $request->all();
            $purchase = $this->purchaseRepository->storePurchase($input);
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }

        return response()->json([
            
            'result' =>[
                'purchase'=>$purchase,
                'message' => __('messages.flash.purchase_saved')
            ]
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     */
    public function show(Purchase $purchase): \Illuminate\View\View
    {
        $purchase = $purchase->load(['purchaseItems.product', 'warehouse', 'supplier']);
        $keyName = [
            'company_email', 'company_name', 'company_phone', 'company_address',
        ];
        $purchase['company_info'] = Setting::whereIn('key', $keyName)->pluck('value', 'key')->toArray();

        return view('purchases.show')->with([
            'purchase' => $purchase 
        ]);
    }

    public function edit(Purchase $purchase)
    {

        return view('purchases.edit')->with($this->getFormParams($purchase));
    }

    public function update(UpdatePurchaseRequest $request, $id)
    {
        
        try {
            $input = $request->all();
            $purchase = $this->purchaseRepository->updatePurchase($input, $id);
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }

        return response()->json([
            
            'result' =>[
                'purchase'=>$purchase,
                'message' => __('messages.flash.purchase_updated')
            ]
        ], 200);
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            //manage stock
            $purchase = $this->purchaseRepository->with('purchaseItems')->where('id', $id)->first();
            foreach ($purchase->purchaseItems as $purchaseItem) {
                $product = ManageStock::whereWarehouseId($purchase->warehouse_id)
                    ->whereProductId($purchaseItem['product_id'])
                    ->first();
                if ($product) {
                    if ($product->quantity >= $purchaseItem['quantity']) {
                        $totalQuantity = $product->quantity - $purchaseItem['quantity'];
                        $product->update([
                            'quantity' => $totalQuantity,
                        ]);
                    } else {
                        throw new UnprocessableEntityHttpException(__('messages.error.available_quantity'));
                    }
                }
            }
            $this->purchaseRepository->delete($id);
            DB::commit();

            return $this->sendSuccess('Purchase Deleted successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig
     */
    public function pdfDownload(Purchase $purchase): JsonResponse
    {
        $purchase = $purchase->load('purchaseItems.product', 'supplier');

        $data = [];
        if (Storage::exists('pdf.purchase-pdf-'.$purchase->reference_code.'.pdf')) {
            Storage::delete('pdf.purchase-pdf-'.$purchase->reference_code.'.pdf');
        }

        $companyLogo = getLogoUrl();

        $companyLogo = (string) \Image::make($companyLogo)->encode('data-url');

        $pdf = PDF::loadView('pdf.purchase-pdf', compact('purchase','companyLogo'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);
        Storage::disk(config('app.media_disc'))->put('pdf/Purchase-'.$purchase->reference_code.'.pdf', $pdf->output());
        $data['purchase_pdf_url'] = Storage::url('pdf/Purchase-'.$purchase->reference_code.'.pdf');

        return $this->sendResponse($data, 'pdf retrieved Successfully');
    }

    public function purchaseInfo(Purchase $purchase): JsonResponse
    {
        $purchase = $purchase->load(['purchaseItems.product', 'warehouse', 'supplier']);
        $keyName = [
            'email', 'company_name', 'phone', 'address',
        ];
        $purchase['company_info'] = Setting::whereIn('key', $keyName)->pluck('value', 'key')->toArray();

        return $this->sendResponse($purchase, 'Purchase information retrieved successfully');
    }

    public function getPurchaseProductReport(Request $request): PurchaseCollection
    {
        $perPage = getPageSize($request);
        $productId = $request->get('product_id');
        $purchases = $this->purchaseRepository->whereHas('purchaseItems', function ($q) use ($productId) {
            $q->where('product_id', '=', $productId);
        })->with(['purchaseItems.product', 'supplier']);

        $purchases = $purchases->paginate($perPage);

        PurchaseResource::usingWithCollection();

        return new PurchaseCollection($purchases);
    }
}
