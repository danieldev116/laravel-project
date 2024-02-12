<?php

namespace App\Http\Livewire;

use App\Models\BaseUnit;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;

class UnitsTable extends LivewireTableComponent
{
    protected $model = Unit::class;

    protected string $tableName = 'units';

    // for table header button
    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'units.components.add-button';

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
            Column::make(__('messages.units.name'), 'name')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.units.short_name'), 'short_name')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.units.base_unit'), 'baseunit.name')
                ->sortable(function (Builder $query, $direction) {
                    return $query->orderBy(BaseUnit::select('name')->whereColumn('base_units.id', 'base_unit'),
                        $direction);
                })
                ->searchable()
                ->format(function ($value, $row, Column $column) {
                    return $row->baseunit->name;
                }),
            Column::make(__('messages.units.created_on'), 'created_at')
                ->sortable()
                ->searchable(),
            Column::make(__('messages.common.action'), 'id')
                ->format(function ($value, $row, Column $column) {
                    return view('livewire.modal-action-button')
                        ->withValue([
                            'data-id' => $row->id,
                            'data-delete-id' => 'unit-delete-btn',
                            'data-edit-id' => 'unit-edit-btn',
                        ]);
                }),
        ];
    }

    public function builder(): Builder
    {
        return Unit::query()->select('units.*');
    }

    public function resetPageTable()
    {
        $this->customResetPage('unitsPage');
    }
}
