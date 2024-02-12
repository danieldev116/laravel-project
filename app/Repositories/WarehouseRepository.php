<?php

namespace App\Repositories;

use App\Models\Purchase;
use App\Models\Sale;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;
use Exception;

use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class WarehouseRepository
 */
class WarehouseRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'phone',
        'country',
        'city',
        'email',
        'zip_code',
        'created_at',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Warehouse::class;
    }

    public function warehouseCanDelete($id): bool
    {
        $saleModel = [
            Sale::class,
        ];
        $purchaseModel = [
            Purchase::class,
        ];
        $saleWarehouseResult = canDelete($saleModel, 'warehouse_id', $id);
        $purchaseWarehouseResult = canDelete($purchaseModel, 'warehouse_id', $id);

        return $saleWarehouseResult || $purchaseWarehouseResult;
    }
    public function store($input)
    {
     

        try {
            DB::beginTransaction();
                
            $baseUnit = Warehouse::create($input);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    
    }
    public function prepareEditFormData($warehouse)
    {
        // dd($warehouse);
        /** @var Warehouse $warehouse */
        // $warehouse = Warehouse::where('id',$warehouse->id)->first();

        // $data['$warehouse'] = $warehouse;


        return $warehouse;
    }

    public function updateWarehouse( $input, $id): bool
    {
        try {
            DB::beginTransaction();
            $warehouse = Warehouse::find($id);
            $warehouse->update($input);
            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
