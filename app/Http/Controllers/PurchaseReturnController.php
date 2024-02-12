<?php

namespace App\Http\Controllers;

use App\Exports\AdminQuotesExport;
use App\Http\Requests\CreatePurchaseReturnRequest;
use App\Http\Requests\UpdatePurchaseReturnRequest;
use App\Models\PurchaseReturn;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Repositories\PurchaseReturnRepository;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Exception;
use App\Models\Setting;
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

class PurchaseReturnController extends AppBaseController
{
    /** @var QuoteRepository */
    public $purchaseReturnRepository;

    public function __construct(PurchaseReturnRepository $purchaseReturnRepository)
    {
        $this->purchaseReturnRepository = $purchaseReturnRepository;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): Factory|View|Application
    {
        
        return view('purchases-returns.index');
    }

    public function create(): View|Factory|Application
    {

        return view('purchases-returns.create')->with($this->getFormParams());
    }


    /**
     * purchase form data
     * @param $purchase
     * @return array
     */
    public function getFormParams($purchase_return = null)
    {

        $warehouses = Warehouse::toBase()->pluck('name', 'id')->toArray();
        $suppliers = Supplier::toBase()->pluck('name', 'id')->toArray();

        return [
            'warehouses' => $warehouses,
            'suppliers' => $suppliers,
            'product_statuses' => PurchaseReturn::OrderStatusses,
            'purchase_return' => ($purchase_return ?? (new PurchaseReturn())),
            'tax_types' => PurchaseReturn::TaxTypes,
            'discount_types' => PurchaseReturn::DiscountTypes,
        ];
    }

    public function store(CreatePurchaseReturnRequest $request)
    {
        try {
            $input = $request->all();
            $purchase_return = $this->purchaseReturnRepository->storePurchaseReturn($input);
            
        } catch (Exception $e) {

            return $this->sendError($e->getMessage());
        }

        return response()->json([
            
            'result' =>[
                'purchase'=>$purchase_return,
                'message' => __('messages.flash.purchase_return_saved')
            ]
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     */
    public function show(PurchaseReturn $purchases_return): \Illuminate\View\View
    {
        
        $purchase_return = $purchases_return->load(['purchaseReturnItems.product', 'warehouse', 'supplier']);
        $keyName = [
            'company_email', 'company_name', 'company_phone', 'company_address',
        ];
        $purchases_return['company_info'] = Setting::whereIn('key', $keyName)->pluck('value', 'key')->toArray();

        return view('purchases-returns.show')->with([
            'purchase_return' => $purchase_return 
        ]);
    }

    public function edit(PurchaseReturn $purchases_return)
    {
       
        return view('purchases-returns.edit')->with($this->getFormParams($purchases_return));
    }

    public function update(UpdatePurchaseReturnRequest $request, $id)
    {
        try {
            $input = $request->all();
            $purchase_return = $this->purchaseReturnRepository->updatePurchaseReturn($input, $id);
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }

        return response()->json([
            
            'result' =>[
                'purchase_return'=>$purchase_return,
                'message' => __('messages.flash.purchase_return_updated')
            ]
        ], 200);
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $purchaseReturn = $this->purchaseReturnRepository->where('id', $id)->with('purchaseReturnItems')->first();
            foreach ($purchaseReturn->purchaseReturnItems as $purchaseReturnItem) {
                manageStock(
                    $purchaseReturn->warehouse_id,
                    $purchaseReturnItem['product_id'],
                    $purchaseReturnItem['quantity']
                );
            }
            $this->purchaseReturnRepository->delete($purchaseReturn->id);
            DB::commit();

            return $this->sendSuccess('Purchase Return Deleted successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig
     */
    public function pdfDownload(PurchaseReturn $purchaseReturn): JsonResponse
    {
        $purchaseReturn = $purchaseReturn->load('purchaseReturnItems.product', 'supplier');

        $data = [];
        if (Storage::exists('pdf/purchase_return-'.$purchaseReturn->reference_code.'.pdf')) {
            Storage::delete('pdf/purchase_return-'.$purchaseReturn->reference_code.'.pdf');
        }

        $companyLogo = getLogoUrl();
        $companyLogo = (string) \Image::make($companyLogo)->encode('data-url');

        $pdf = PDF::loadView('pdf.purchase-return-pdf', compact('purchaseReturn','companyLogo'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);

        Storage::disk(config('app.media_disc'))->put('pdf/purchase_return-'.$purchaseReturn->reference_code.'.pdf',
            $pdf->output());
        $data['purchase_return_pdf_url'] = Storage::url('pdf/purchase_return-'.$purchaseReturn->reference_code.'.pdf');

        return $this->sendResponse($data, 'purchase return pdf retrieved Successfully');
    }

}
