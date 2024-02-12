<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use App\Models\Product;
use App\Repositories\SupplierRepository;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupplierController extends AppBaseController
{
    /** @var SupplierRepository */
    public $supplierRepository;

    public function __construct(SupplierRepository $supplierRepo)
    {
        $this->supplierRepository = $supplierRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): \Illuminate\View\View
    {
        return view('suppliers.index');
    }
    public function create(): View|Factory|Application
    {

        return view('suppliers.create');
    }
    public function store(CreateSupplierRequest $request): JsonResponse
    {
        $input = $request->all();
        $supplier = $this->supplierRepository->store($input);

        return $this->sendResponse($supplier, __('Successed Save'));
    }

    public function edit( $supplierId): JsonResponse
    {
        $supplier = Supplier::where('id', $supplierId)->first();

        return $this->sendResponse($supplier, __('messages.flash.category_retrieved'));
    }

    public function update(UpdatesupplierRequest $request, $supplierId): JsonResponse
    {
        $input = $request->all();
        $this->supplierRepository->updateSupplier($input, $supplierId);

        return $this->sendSuccess(__('messages.flash.supplier_updated'));
    }

    /**
     * @param  supplier  $supplier
     */
    public function destroy($id): JsonResponse
    {
        $supplier = Supplier::whereId($id)->whereTenantId(Auth::user()->tenant_id)->first();
        if (! $supplier) {
            return $this->sendError(__('Seems, you are not allowed to access this record.'));
        }
        $productModels = [
            Product::class,
        ];
        $result = canDelete($productModels, 'supplier_id', $supplier->id);
        if ($result) {
            return $this->sendError(__('messages.flash.supplier_cant_deleted'));
        }
        $supplier->delete();

        return $this->sendSuccess(__('messages.flash.supplier_deleted'));
    }
}
