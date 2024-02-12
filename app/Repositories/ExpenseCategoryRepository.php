<?php

namespace App\Repositories;
use App\Models\ExpenseCategory;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class ExpenseCategoryRepository
 */
class ExpenseCategoryRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'description',
        'created_at',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }
    public function store($input): bool
    {
  
        try {
            DB::beginTransaction();
            $data['name'] = $input['name'];
            $Unit = ExpenseCategory::create($data);
            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    public function updateExpenseCategory(array $input, int $id): bool
    {
        try {
            DB::beginTransaction();

            $unit = ExpenseCategory::find($id);
            $unit->update($input);

            DB::commit();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
    /**
     * Configure the Model
     **/
    public function model()
    {
        return ExpenseCategory::class;
    }
}
