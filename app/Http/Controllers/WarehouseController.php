<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateWarehouseRequest;
use App\Http\Requests\UpdateWarehouseRequest;
use App\Models\Warehouse;
use App\Models\Product;
use App\Repositories\WarehouseRepository;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laracasts\Flash\Flash;

class WarehouseController extends AppBaseController
{
    /** @var WarehouseRepository */
    public $warehouseRepository;

    public function __construct(WarehouseRepository $warehouseRepo)
    {
        $this->warehouseRepository = $warehouseRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): \Illuminate\View\View
    {
        return view('warehouse.index');
    }
    public function create(): View|Factory|Application
    {
        return view('warehouse.create');
    }
    public function store(CreateWarehouseRequest $request): JsonResponse
    {
        $input = $request->all();
        $warehouse = $this->warehouseRepository->store($input);

        return $this->sendResponse($warehouse, __('messages.flash.quote_saved'));
    }

    public function edit(Warehouse $warehouse)
    {
    
        $warehouse = Warehouse::where('id', $warehouse->id)->first();
        return view('warehouse.edit', compact('warehouse'));

    }
    public function update(UpdateWarehouseRequest $request, $warehouseId): JsonResponse
    {
        $input = $request->all();
        $data=  $this->warehouseRepository->updateWarehouse($input, $warehouseId);

        return $this->sendResponse($data, __('messages.flash.quote_updated'));
    }

    /**
     * @param  warehouse  $warehouse
     */
    public function destroy($id): JsonResponse
    {
        $warehouse = Warehouse::whereId($id)->first();
        if (! $warehouse) {
            return $this->sendError(__('Seems, you are not allowed to access this record.'));
        }
        
        $warehouse->delete();

        return $this->sendSuccess(__('messages.flash.warehouse_deleted'));
    }
}
