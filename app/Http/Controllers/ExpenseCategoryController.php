<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateExpenseCategoryRequest;
use App\Http\Requests\UpdateExpenseCategoryRequest;
use App\Models\ExpenseCategory;
use App\Repositories\ExpenseCategoryRepository;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseCategoryController extends AppBaseController
{
    /** @var ExpenseCategoryRepository */
    public $expenseCategoryRepository;

    public function __construct(ExpenseCategoryRepository $unitRepo)
    {
        $this->expenseCategoryRepository = $unitRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): \Illuminate\View\View
    {
        $base = ExpenseCategory::toBase()->pluck('name', 'id')->toArray();
        return view('expense-category.index', compact('base'));
        
    }

    public function store(CreateExpenseCategoryRequest $request): JsonResponse
    {
        $input = $request->all();
           $this->expenseCategoryRepository->store($input);

        return $this->sendSuccess(__('messages.flash.category_saved'));
    }

    public function edit($unitId)
    {

        $unit = ExpenseCategory::where('id', $unitId)->first();

        return $this->sendResponse($unit, __('messages.flash.category_retrieved'));
    }

    public function update(UpdateExpenseCategoryRequest $request, $unitId): JsonResponse
    {

        $input = $request->all();
        $this->expenseCategoryRepository->updateExpenseCategory($input, $unitId);

        return $this->sendSuccess(__('messages.flash.category_updated'));
    }

    /**
     * @param  Unit  $baseunit
     */
    public function destroy($id): JsonResponse
    {

        $defaultUnit = ExpenseCategory::whereId($id)->first();
            
        $defaultUnit->delete();

        return $this->sendSuccess(__('messages.flash.category_deleted'));
    }
}
