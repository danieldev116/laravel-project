<?php

namespace App\Http\Controllers;

use App\Exports\AdminTransfersExport;
use App\Http\Requests\CreateTransferRequest;
use App\Http\Requests\UpdateTransferRequest;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Transfer;
use App\Models\Setting;
use App\Models\ManageStock;
use App\Repositories\TransferRepository;
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
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;


class TransferController extends AppBaseController
{
    /** @var TransferRepository */
    public $transferRepository;

    public function __construct(TransferRepository $transferRepo)
    {
        $this->transferRepository = $transferRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): Factory|View|Application
    {
        $statusArr = Transfer::OrderStatusses;
        $status = $request->status;

        return view('transfers.index', compact('statusArr', 'status'));
    }

    public function create(): View|Factory|Application
    {
        return view('transfers.create')->with($this->getFormParams());
    }
    public function getFormParams($transfer = null)
    {

        $warehouses = Warehouse::toBase()->pluck('name', 'id')->toArray();

        return [
            'warehouses' => $warehouses,
            'product_statuses' => Transfer::OrderStatusses,
            'transfer' => ($transfer ?? (new Transfer())),
            'tax_types' => Transfer::TaxTypes,
            'discount_types' => Transfer::DiscountTypes,
        ];
    }
    public function store(CreateTransferRequest $request): mixed
    {
          
        try {
            $input = $request->all();
            $transfer = $this->transferRepository->storeTransfer($input);
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }

        return response()->json([
            
            'result' =>[
                'transfer'=>$transfer,
                'message' => __('messages.flash.transfer_saved')
            ]
        ], 200);
    }
    public function getProduct($productId): JsonResponse
    {
        $product = Product::where('code', $productId)->get()->toArray();
        if (count($product)>0) {
            return $this->sendResponse($product, __('messages.flash.product_price_retrieved'));
        } else {
            Flash::error(__('messages.flash.adjustment_can_not_editable'));
            return $this->sendResponse(null, __('messages.flash.product_not_found'));
        }

        
    }
    /**
     * Display the specified resource.
     *
     */
    public function show(Transfer $transfer): \Illuminate\View\View
    {
        $transfer = $transfer->load(['transferItems.product', 'fromWarehouse','toWarehouse']);
        $keyName = [
            'company_email', 'company_name', 'company_phone', 'company_address',
        ];
        $transfer['company_info'] = Setting::whereIn('key', $keyName)->pluck('value', 'key')->toArray();

        return view('transfers.show')->with([
            'transfer' => $transfer 
        ]);
    }

    public function edit(Transfer $transfer)
    {
        return view('transfers.edit')->with($this->getFormParams($transfer));
    }

    public function update(UpdateTransferRequest $request, Transfer $transfer): JsonResponse
    {
        $input = $request->all();
        try {
            DB::beginTransaction();
            $transfer = $this->transferRepository->updateTransfer($transfer->id, $input);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();

            return $this->sendError($e->getMessage());
        }
        Flash::success(__('messages.flash.transfer_updated'));

        return $this->sendResponse($transfer, __('messages.flash.transfer_updated'));
    }

    public function destroy($id): JsonResponse
    {
        try {
            DB::beginTransaction();
            //manage stock
          
            $transfer = $this->transferRepository->with('transferItems')->where('id', $id)->first();
            foreach ($transfer->transferItems as $transferItem) {
                $product = ManageStock::whereWarehouseId($transfer->warehouse_id)
                    ->whereProductId($transferItem['product_id'])
                    ->first();
                if ($product) {
                    if ($product->quantity >= $transferItem['quantity']) {
                        $totalQuantity = $product->quantity - $transferItem['quantity'];
                        $product->update([
                            'quantity' => $totalQuantity,
                        ]);
                    } else {
                        throw new UnprocessableEntityHttpException(__('messages.error.available_quantity'));
                    }
                }
            }
            $this->transferRepository->delete($id);
            DB::commit();

            return $this->sendSuccess('transfer Deleted successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }


    public function convertToPdf($transferId): Response
    {
        $transfer = Transfer::whereId($transferId)->whereTenantId(Auth::user()->tenant_id)->firstOrFail();
        ini_set('max_execution_time', 36000000);
        $transfer->load('client.user', 'transferTemplate', 'transferItems.product', 'transferItems');
        $transferData = $this->transferRepository->getPdfData($transfer);
        $transferTemplate = $this->transferRepository->getDefaultTemplate($transfer);
        $pdf = PDF::loadView("transfers.transfer_template_pdf.$transferTemplate", $transferData);

        return $pdf->stream('transfer.pdf');
    }

    public function convertToInvoice(Request $request): mixed
    {
        $transferId = $request->transferId;
        $transfer = transfer::whereId($transferId)->firstOrFail();

        $transferDatas = $this->transferRepository->gettransferData($transfer);
        $transferData = $transferDatas['transfer'];
        $transferItems = $transferDatas['transfer']['transferItems'];

        if (! empty(getSettingValue('invoice_no_prefix'))) {
            $transferData['transfer_id'] = getSettingValue('invoice_no_prefix').'-'.$transferData['transfer_id'];
        }
        if (! empty(getSettingValue('invoice_no_suffix'))) {
            $transferData['transfer_id'] .= '-'.getSettingValue('invoice_no_suffix');
        }

        $invoice['invoice_id'] = $transferData['transfer_id'];
        $invoice['client_id'] = $transferData['client_id'];
        $invoice['invoice_date'] = Carbon::parse($transferData['transfer_date'])->format(currentDateFormat());
        $invoice['due_date'] = Carbon::parse($transferData['due_date'])->format(currentDateFormat());
        $invoice['amount'] = $transferData['amount'];
        $invoice['final_amount'] = $transferData['final_amount'];
        $invoice['discount_type'] = $transferData['discount_type'];
        $invoice['discount'] = $transferData['discount'];
        $invoice['note'] = $transferData['note'];
        $invoice['term'] = $transferData['term'];
        $invoice['template_id'] = $transferData['template_id'];
        $invoice['recurring'] = $transferData['recurring'];
        $invoice['status'] = Invoice::DRAFT;

        $invoice = Invoice::create($invoice);

        foreach ($transferItems as $transferItem) {
            $invoiceItem = InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'product_id' => $transferItem['product_id'],
                'product_name' => $transferItem['product_name'],
                'quantity' => $transferItem['quantity'],
                'price' => $transferItem['price'],
                'total' => $transferItem['total'],
            ]);
        }

        transfer::whereId($transferId)->update(['status' => transfer::CONVERTED]);

        return $this->sendSuccess(__('messages.flash.converted_to_invoice'));
    }

    public function exporttransfersExcel(): BinaryFileResponse
    {
        return Excel::download(new AdmintransfersExport(), 'transfer-excel.xlsx');
    }

    public function getPublictransferPdf($transferId): Response
    {
        $transfer = transfer::wheretransferId($transferId)->first();
        $transfer->load('client.user', 'transferTemplate', 'transferItems.product', 'transferItems');
        $transferData = $this->transferRepository->getPdfData($transfer);
        $transferTemplate = $this->transferRepository->getDefaultTemplate($transfer);
        $pdf = PDF::loadView("transfers.transfer_template_pdf.$transferTemplate", $transferData);

        return $pdf->stream('transfer.pdf');
    }

    public function showPublictransfer($transferId): View|Factory|Application
    {
        $transfer = transfer::with('client.user')->wheretransferId($transferId)->firstOrFail();

        $transferData = $this->transferRepository->gettransferData($transfer);

        $transferData['statusArr'] = transfer::STATUS_ARR;
        $transferData['status'] = $transfer->status;

        return view('transfers.public_view')->with($transferData);
    }

    public function exporttransfersPdf(): Response
    {
        ini_set('max_execution_time', 36000000);
        $data['transfers'] = transfer::with('client.user')->orderBy('created_at', 'desc')->get();
        $transfersPdf = PDF::loadView('transfers.export_transfers_pdf', $data);

        return $transfersPdf->download('transfers.pdf');
    }
}
