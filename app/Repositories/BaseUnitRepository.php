<?php

namespace App\Repositories;

use App\Models\BaseUnit;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class BaseUnitRepository
 */
class BaseUnitRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'created_at',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'name',
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
        return BaseUnit::class;
    }

    public function baseUnitCantDelete($id): bool
    {
        $productModels = [
            Product::class,
        ];
        $unitModels = [
            Unit::class,
        ];

        $productPurchaseResult = canDelete($productModels, 'product_unit', $id);
        $productUnitResult = canDelete($unitModels, 'base_unit', $id);
        if ($productPurchaseResult || $productUnitResult) {
            return true;
        }

        return false;
    }
    public function store($input): bool
    {
        try {
            DB::beginTransaction();

            $baseUnit = BaseUnit::create($input);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function updateBaseUnit(array $input, int $id): bool
    {
        try {
            DB::beginTransaction();

            $category = BaseUnit::find($id);
            $category->update($input);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

}
