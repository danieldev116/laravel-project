<?php

namespace App\Http\Livewire;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;

class BrandsTable extends LivewireTableComponent
{
    protected $model = Brand::class;

    protected string $tableName = 'brands';

    // for table header button
    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'brands.components.add-button';

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
            Column::make(__('messages.brands.brands'), 'name')
                ->sortable()
                ->searchable()
             ->view('brands.components.name'),
            Column::make(__('messages.brands.product_count'), 'id')
                ->sortable()
                ->searchable()
                ->format(function ($value, $row, Column $column) {
                    return $row->products_count;
                }),
            Column::make(__('messages.common.action'), 'id')
                ->format(function ($value, $row, Column $column) {
                    return view('livewire.modal-action-button')
                        ->withValue([
                            'data-id' => $row->id,
                            'data-delete-id' => 'brand-delete-btn',
                            'data-edit-id' => 'brand-edit-btn',
                        ]);
                }),
        ];
    }

    public function builder(): Builder
    {
        return Brand::withCount('products');
    }

    public function resetPageTable()
    {
        $this->customResetPage('brandsPage');
    }
}
