<?php

namespace App\Http\Livewire;

use App\Models\Expense;
use App\Models\Warehouse;
use App\Models\ExpenseCategory;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;

class ExpenseTable extends LivewireTableComponent
{
    protected $model = Expense::class;

    protected string $tableName = 'expenses';

    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'expense.components.add-button';

    public $status;

    protected $queryString = ['status'];

    public function configure(): void
    {
        $this->setPrimaryKey('id');
        $this->setDefaultSort('created_at', 'desc');
        $this->setQueryStringStatus(false);

        $this->setThAttributes(function (Column $column) {
            return [
                'class' => 'text-center',
            ];
        });

        $this->setTdAttributes(function (Column $column, $row, $columnIndex, $rowIndex) {
            if (in_array($column->getField(), ['reference_code', 'title', 'warehouse_id'])) {
                return [
                    'style' => 'd-flex justify-content-end',
                ];
            }
            return [
            ];
        });
    }

    public function columns(): array
    {
        return [

            Column::make(__('messages.expenses.expense_reference'), 'reference_code')
                ->sortable()
                ->searchable()
                ->view('expense.components.refence'),

            Column::make(__('messages.expenses.expense_title'), 'title')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.expenses.expense_warehouse'), 'warehouse.name')
            ->sortable(function (Builder $query, $direction) {
                return $query->orderBy(Warehouse::select('name')->whereColumn('warehouse.id', 'warehouse_id'),
                    $direction);
            })
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return $row->warehouse->name;
            }),
            Column::make(__('messages.expenses.expense_category'), 'expense_category_id')
            ->sortable(function ($query, $direction) {
                $query->orderBy('expense_category_id', $direction);
            })
            ->searchable()
            ->format(function ($value, $row) {
                return $row->expenseCategory->name;
            }),
     
            Column::make(__('messages.expenses.expense_amount'), 'amount')
                ->sortable()
                ->searchable()
                ->format(function ($value, $row, Column $column) {
                    return getCurrencySymbol()." ".numberFormat($row->amount);
                }),
            Column::make(__('messages.expenses.expense_created_on'), 'created_at')
            ->sortable()
            ->searchable()
            ->view('expense.components.created-at'),
            Column::make(__('messages.common.action'), 'id')
                ->format(function ($value, $row, Column $column) {
                    return view('livewire.action-button')
                        ->withValue([
                            'edit-route' => route('expenses.edit', $row->id),
                            'data-id' => $row->id,
                            'data-delete-id' => 'expense-delete-btn',
                        ]);
                }),
        ];
    }

    public function builder(): Builder
    {
        return Expense::query()->select('expenses.*');
    }

    // public function filters(): array
    // {
    //     $status = Quote::STATUS_ARR;
    //     unset($status[Quote::STATUS_ALL]);

    //     return [
    //         SelectFilter::make(__('messages.common.status').':')
    //             ->options($status)
    //             ->filter(function (Builder $builder, string $value) {
    //                 $builder->where('quotes.status', '=', $value);
    //             }),
    //     ];
    // }

    public function resetPageTable()
    {
        $this->customResetPage('expensePage');
    }
}
