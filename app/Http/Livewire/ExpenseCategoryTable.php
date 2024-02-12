<?php

namespace App\Http\Livewire;

use App\Models\ExpenseCategory;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;

class ExpenseCategoryTable extends LivewireTableComponent
{
    protected $model = ExpenseCategory::class;

    protected string $tableName = 'expense_categories';

    // for table header button
    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'expense-category.components.add-button';

    public function configure(): void
    {
        $this->setPrimaryKey('id');
        $this->setPageName('page');
        $this->setDefaultSort('created_at', 'desc');
        $this->setQueryStringStatus(false);

        $this->setTdAttributes(function (Column $column, $row, $columnIndex, $rowIndex) {
            if (in_array($column->getField(), ['name'])) {
                return [
                    'class' => 'w-50',
                ];
            }
            if ($columnIndex == '1') {
                return [
                    'class' => 'text-center',
                ];
            }

            return [];
        });
        $this->setThAttributes(function (Column $column) {
            if ($column->getField() == 'id') {
                return [
                    'style' => 'width:9%;text-align:center',
                ];
            }

            return [];
        });
    }

    public function columns(): array
    {
        return [
            Column::make(__('messages.expenses.name'), 'name')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.common.action'), 'id')
                ->format(function ($value, $row, Column $column) {
                    return view('livewire.modal-action-button')
                        ->withValue([
                            'data-id' => $row->id,
                            'data-delete-id' => 'expense_category-delete-btn',
                            'data-edit-id' => 'expense_category-edit-btn',
                        ]);
                }),
        ];
    }

    public function builder(): Builder
    {
        return ExpenseCategory::query()->select('expense_categories.*');
    }

    public function resetPageTable()
    {
        $this->customResetPage('expenseCategoryPage');
    }
}
