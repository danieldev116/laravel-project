<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Warehouse;
use App\Repositories\ExpenseRepository;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends AppBaseController
{
    /** @var ExpenseRepository */
    public $expenseRepository;

    public function __construct(ExpenseRepository $unitRepo)
    {
        $this->expenseRepository = $unitRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): \Illuminate\View\View
    {
        return view('expense.index');
        
    }

    public function create(): View|Factory|Application
    {

        return view('expense.create')->with($this->getFormParams());
    }

    /**
     * adjustment form data
     * @param $adjustment
     * @return array
     */
    public function getFormParams($adjustment = null)
    {

        $warehouses = Warehouse::toBase()->pluck('name', 'id')->toArray();
        $expenses = ExpenseCategory::toBase()->pluck('name', 'id')->toArray();

        return [
            'warehouses' => $warehouses,
            'expenses' =>  $expenses,
        ];
    }
    public function store(CreateExpenseRequest $request): JsonResponse
    {
           $input = $request->all();
           $expense =  $this->expenseRepository->storeExpense($input);
           return $this->sendResponse($expense, __('messages.flash.brand_saved'));
    }

    public function edit($unitId)
    {

        $expense = Expense::where('id', $unitId)->first();
        $warehouses = Warehouse::toBase()->pluck('name', 'id')->toArray();
        $expense_category = ExpenseCategory::toBase()->pluck('name', 'id')->toArray();
        return view('expense.edit', compact('expense','warehouses','expense_category'));
     
    }

    public function update(UpdateExpenseRequest $request, $unitId): JsonResponse
    {

        $input = $request->all();
        $data= $this->expenseRepository->updateExpense($input, $unitId);

        return $this->sendResponse($data, __('messages.flash.quote_updated'));
    }

    /**
     * @param  Unit  $baseunit
     */
    public function destroy($id): JsonResponse
    {

        $defaultUnit = Expense::whereId($id)->first();
            
        $defaultUnit->delete();

        return $this->sendSuccess(__('messages.flash._deleted'));
    }
}
