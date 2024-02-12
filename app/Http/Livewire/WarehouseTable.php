<?php

namespace App\Http\Livewire;

use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;

class WarehouseTable extends LivewireTableComponent
{
    protected $model = Warehouse::class;

    protected string $tableName = 'warehouses';

    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'warehouse.components.add-button';

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
            if (in_array($column->getField(), ['name', 'phone', 'country'])) {
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

            Column::make(__('messages.warehouse.warehouse_name'), 'name')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.warehouse.warehouse_phone_number'), 'phone')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.warehouse.warehouse_country'), 'country')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.warehouse.warehouse_city'), 'city')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.warehouse.warehouse_zip_code'), 'zip_code')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.warehouse.warehouse_created_on'), 'created_at')
            ->sortable()
            ->searchable()
            ->view('warehouse.components.created-at'),
            Column::make(__('messages.common.action'), 'id')
                ->format(function ($value, $row, Column $column) {
                    return view('livewire.action-button')
                        ->withValue([
                            'edit-route' => route('warehouse.edit', $row->id),
                            'data-id' => $row->id,
                            'data-delete-id' => 'warehouse-delete-btn',
                        ]);
                }),
      

        ];
    }

    public function builder(): Builder
    {
        return Warehouse::query()->select('warehouses.*');

    }

    public function resetPageTable()
    {
        $this->customResetPage('warehousesPage');
    }
}
