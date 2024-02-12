<?php

namespace App\Http\Controllers;

use App\Exports\AdminQuotesExport;
use App\Http\Requests\CreateSaleRequest;
use App\Http\Requests\UpdateSaleRequest;
use App\Models\Customer;
use App\Models\Hold;
use App\Models\Sale;
use App\Models\Warehouse;
use App\Repositories\SaleRepository;
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

class SaleController extends AppBaseController
{
    /** @var QuoteRepository */
    public $saleRepository;

    public function __construct(SaleRepository $saleRepository)
    {
        $this->saleRepository = $saleRepository;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): Factory|View|Application
    {
        
        return view('sales.index');
    }

    public function create(): View|Factory|Application
    {

        return view('sales.create')->with($this->getFormParams());
    }

    public function store(CreateSaleRequest $request)
    {
        if (isset($request->hold_ref_no)) {
            $holdExist = Hold::whereReferenceCode($request->hold_ref_no)->first();
            if (! empty($holdExist)) {
                $holdExist->delete();
            }
        }
        $input = $request->all();
        $sale = $this->saleRepository->storeSale($input);

        return new SaleResource($sale);
    }

    /**
     * Display the specified resource.
     *
     */
    public function show(Quote $quote): \Illuminate\View\View
    {
        $quoteData = $this->quoteRepository->getQuoteData($quote);

        return view('quotes.show')->with($quoteData);
    }

    public function edit(Sale $sale)
    {
        return view('quotes.edit', compact('quote'))->with($this->getFormParams($sale));
    }

    public function update(UpdateSaleRequest $request, $id)
    {
        $input = $request->all();
        $sale = $this->saleRepository->updateSale($input, $id);

        return new SaleResource($sale);
    }

     /**
     * purchase form data
     * @param $purchase
     * @return array
     */
    public function getFormParams($sale = null)
    {

        $warehouses = Warehouse::toBase()->pluck('name', 'id')->toArray();
        $customers = Customer::toBase()->pluck('name', 'id')->toArray();

        return [
            'warehouses' => $warehouses,
            'customers' => $customers,
            'sale_statuses' => Sale::SaleOrderStatuses,
            'payment_statuses' =>Sale::SalePaymentStatuses,
            'sale' => ($sale ?? (new Sale())),
            'tax_types' => Sale::TaxTypes,
            'discount_types' => Sale::DiscountTypes,
        ];
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $sale = $this->saleRepository->with('saleItems')->where('id', $id)->first();
            foreach ($sale->saleItems as $saleItem) {
                manageStock($sale->warehouse_id, $saleItem['product_id'], $saleItem['quantity']);
            }
            if (File::exists(Storage::path('sales/barcode-'.$sale->reference_code.'.png'))) {
                File::delete(Storage::path('sales/barcode-'.$sale->reference_code.'.png'));
            }
            $this->saleRepository->delete($id);
            DB::commit();

            return $this->sendSuccess('Sale Deleted successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig
     */
    public function pdfDownload(Sale $sale): JsonResponse
    {
        $sale = $sale->load('customer', 'saleItems.product', 'payments');
        $data = [];
        if (Storage::exists('pdf/Sale-'.$sale->reference_code.'.pdf')) {
            Storage::delete('pdf/Sale-'.$sale->reference_code.'.pdf');
        }
        $companyLogo = getLogoUrl();

        $companyLogo = (string) \Image::make($companyLogo)->encode('data-url');

        $pdf = PDF::loadView('pdf.sale-pdf', compact('sale', 'companyLogo'))->setOptions([
            'tempDir' => public_path(),
            'chroot' => public_path(),
        ]);
        Storage::disk(config('app.media_disc'))->put('pdf/Sale-'.$sale->reference_code.'.pdf', $pdf->output());
        $data['sale_pdf_url'] = Storage::url('pdf/Sale-'.$sale->reference_code.'.pdf');

        return $this->sendResponse($data, 'pdf retrieved Successfully');
    }
}
