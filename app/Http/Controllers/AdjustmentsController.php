<?php

namespace App\Http\Controllers;


use App\Models\Product;
use App\Models\Adjustment;
use App\Models\AdjustmentItem;
use App\Models\ManageStock;
use App\Models\Warehouse;
use App\Repositories\AdjustmentRepository;
use App\Http\Requests\CraeteAdjustmentRequest;
use App\Http\Requests\UpdateAdjustmentRequest;
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

class AdjustmentsController extends AppBaseController
{
    /** @var AdjustmentRepository */
    public $adjustmentRepository;

    public function __construct(AdjustmentRepository $adjustmentRepo)
    {
        $this->adjustmentRepository = $adjustmentRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): Factory|View|Application
    {
        
        return view('adjustments.index');
    }

 
    public function create(): View|Factory|Application
    {

        return view('adjustments.create')->with($this->getFormParams());
    }

    /**
     * adjustment form data
     * @param $adjustment
     * @return array
     */
    public function getFormParams($adjustment = null)
    {

        $warehouses = Warehouse::toBase()->pluck('name', 'id')->toArray();

        return [
            'warehouses' => $warehouses,
            'adjustment' => ($adjustment ?? (new Adjustment())),
        ];
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

    public function store(Request $request)
    {

        try {
            $input = $request->all();
            $adjustment = $this->adjustmentRepository->storeAdjustment($input);
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }

        return response()->json([
            
            'result' =>[
                'adjustment'=>$adjustment,
                'message' => __('messages.flash.adjustment_saved')
            ]
        ], 200);
    }

    public function edit(Adjustment $adjustment)
    {
        return view('adjustments.edit')->with($this->getFormParams($adjustment));
    }

    public function update(UpdateAdjustmentRequest $request, $id): JsonResponse
    {
        // $input = $request->all();
        // try {
        //     DB::beginTransaction();
        //     $adjustment = $this->adjustmentRepository->updateadjustment($adjustment->id, $input);
        //     DB::commit();
        // } catch (Exception $e) {
        //     DB::rollBack();

        //     return $this->sendError($e->getMessage());
        // }
        // Flash::success(__('messages.flash.adjustment_updated'));

        // return $this->sendResponse($adjustment, __('messages.flash.adjustment_updated'));
        try {
            $input = $request->all();
            $adjustment = $this->adjustmentRepository->updateAdjustment($id,$input);
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }

        return response()->json([
            
            'result' =>[
                'adjustment'=>$adjustment,
                'message' => __('messages.flash.adjustment_updated')
            ]
        ], 200);
    }

  
    public function destroy(int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $adjustment=Adjustment::with('adjustmentItems')->find($id);
            // $adjustment = $this->adjustmentRepository->with('adjustmentItems')->where('id', $id)->firstOrFail();

            foreach ($adjustment->adjustmentItems as $adjustmentItem) {
                $oldItem = AdjustmentItem::whereId($adjustmentItem->id)->firstOrFail();
                $existProductStock = ManageStock::whereWarehouseId($adjustment->warehouse_id)->whereProductId($oldItem->product_id)->first();

                if ($oldItem->method_type == AdjustmentItem::METHOD_ADDITION) {
                    $totalQuantity = $existProductStock->quantity - $oldItem['quantity'];
                } else {
                    $totalQuantity = $existProductStock->quantity + $oldItem['quantity'];
                }

                $existProductStock->update([
                    'quantity' => $totalQuantity,
                ]);
            }

            $this->adjustmentRepository->delete($id);

            DB::commit();

            return $this->sendSuccess('Adjustment delete successfully');
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    // public function convertToPdf($adjustmentId): Response
    // {
    //     $adjustment = Adjustment::whereId($adjustmentId)->whereTenantId(Auth::user()->tenant_id)->firstOrFail();
    //     ini_set('max_execution_time', 36000000);
    //     $adjustment->load('client.user', 'adjustmentTemplate', 'adjustmentItems.product', 'adjustmentItems');
    //     $adjustmentData = $this->adjustmentRepository->getPdfData($adjustment);
    //     $adjustmentTemplate = $this->adjustmentRepository->getDefaultTemplate($adjustment);
    //     $pdf = PDF::loadView("adjustments.adjustment_template_pdf.$adjustmentTemplate", $adjustmentData);

    //     return $pdf->stream('adjustment.pdf');
    // }

    // public function convertToInvoice(Request $request): mixed
    // {
    //     $adjustmentId = $request->adjustmentId;
    //     $adjustment = Adjustment::whereId($adjustmentId)->firstOrFail();

    //     $adjustmentDatas = $this->adjustmentRepository->getadjustmentData($adjustment);
    //     $adjustmentData = $adjustmentDatas['adjustment'];
    //     $adjustmentItems = $adjustmentDatas['adjustment']['adjustmentItems'];

    //     if (! empty(getSettingValue('invoice_no_prefix'))) {
    //         $adjustmentData['adjustment_id'] = getSettingValue('invoice_no_prefix').'-'.$adjustmentData['adjustment_id'];
    //     }
    //     if (! empty(getSettingValue('invoice_no_suffix'))) {
    //         $adjustmentData['adjustment_id'] .= '-'.getSettingValue('invoice_no_suffix');
    //     }

    //     $invoice['invoice_id'] = $adjustmentData['adjustment_id'];
    //     $invoice['client_id'] = $adjustmentData['client_id'];
    //     $invoice['invoice_date'] = Carbon::parse($adjustmentData['adjustment_date'])->format(currentDateFormat());
    //     $invoice['due_date'] = Carbon::parse($adjustmentData['due_date'])->format(currentDateFormat());
    //     $invoice['amount'] = $adjustmentData['amount'];
    //     $invoice['final_amount'] = $adjustmentData['final_amount'];
    //     $invoice['discount_type'] = $adjustmentData['discount_type'];
    //     $invoice['discount'] = $adjustmentData['discount'];
    //     $invoice['note'] = $adjustmentData['note'];
    //     $invoice['term'] = $adjustmentData['term'];
    //     $invoice['template_id'] = $adjustmentData['template_id'];
    //     $invoice['recurring'] = $adjustmentData['recurring'];
    //     $invoice['status'] = Invoice::DRAFT;

    //     $invoice = Invoice::create($invoice);

    //     foreach ($adjustmentItems as $adjustmentItem) {
    //         $invoiceItem = InvoiceItem::create([
    //             'invoice_id' => $invoice->id,
    //             'product_id' => $adjustmentItem['product_id'],
    //             'product_name' => $adjustmentItem['product_name'],
    //             'quantity' => $adjustmentItem['quantity'],
    //             'price' => $adjustmentItem['price'],
    //             'total' => $adjustmentItem['total'],
    //         ]);
    //     }

    //     Adjustment::whereId($adjustmentId)->update(['status' => Adjustment::CONVERTED]);

    //     return $this->sendSuccess(__('messages.flash.converted_to_invoice'));
    // }

    // public function exportadjustmentsExcel(): BinaryFileResponse
    // {
    //     return Excel::download(new AdminadjustmentsExport(), 'adjustment-excel.xlsx');
    // }

    // public function getPublicadjustmentPdf($adjustmentId): Response
    // {
    //     $adjustment = Adjustment::whereadjustmentId($adjustmentId)->first();
    //     $adjustment->load('client.user', 'adjustmentTemplate', 'adjustmentItems.product', 'adjustmentItems');
    //     $adjustmentData = $this->adjustmentRepository->getPdfData($adjustment);
    //     $adjustmentTemplate = $this->adjustmentRepository->getDefaultTemplate($adjustment);
    //     $pdf = PDF::loadView("adjustments.adjustment_template_pdf.$adjustmentTemplate", $adjustmentData);

    //     return $pdf->stream('adjustment.pdf');
    // }

    // public function showPublicadjustment($adjustmentId): View|Factory|Application
    // {
    //     $adjustment = Adjustment::with('client.user')->whereadjustmentId($adjustmentId)->firstOrFail();

    //     $adjustmentData = $this->adjustmentRepository->getadjustmentData($adjustment);

    //     $adjustmentData['statusArr'] = Adjustment::STATUS_ARR;
    //     $adjustmentData['status'] = $adjustment->status;

    //     return view('adjustments.public_view')->with($adjustmentData);
    // }

    // public function exportadjustmentsPdf(): Response
    // {
    //     ini_set('max_execution_time', 36000000);
    //     $data['adjustments'] = Adjustment::with('client.user')->orderBy('created_at', 'desc')->get();
    //     $adjustmentsPdf = PDF::loadView('adjustments.export_adjustments_pdf', $data);

    //     return $adjustmentsPdf->download('adjustments.pdf');
    // }
}
