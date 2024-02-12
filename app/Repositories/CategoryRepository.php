<?php

namespace App\Repositories;

use App\Models\Category;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class ProductCategoryRepository
 */
class CategoryRepository extends BaseRepository
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
    public function model(): string
    {
        return Category::class;
    }

    /**
     * @return LengthAwarePaginator|Collection|mixed
     */
    public function storeCategory($input)
    {
        try {
            DB::beginTransaction();
            $productCategory = $this->create($input);
            if (isset($input['image']) && $input['image']) {
                $media = $productCategory->addMedia($input['image'])->toMediaCollection(Category::PATH,
                    config('app.media_disc'));
            }
            DB::commit();

            return $productCategory;

        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }

    /**
     * @return LengthAwarePaginator|Collection|mixed
     */
    public function updateCategory($input, $id)
    {
        try {
            DB::beginTransaction();
            $productCategory = $this->withCount('products');
            $productCategory = $productCategory->update($input, $id);
            if (isset($input['image']) && $input['image']) {
                $productCategory->clearMediaCollection(Category::PATH);
                $productCategory->media()->delete();
                $productCategory['image_url'] = $productCategory->addMedia($input['image'])->toMediaCollection(Category::PATH,
                    config('app.media_disc'));
            }
            DB::commit();

            return $productCategory;

        } catch (Exception $e) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($e->getMessage());
        }
    }
}
