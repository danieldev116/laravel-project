<?php
namespace App\Http\Livewire;

use App\Models\Adjustment;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;
use Rappasoft\LaravelLivewireTables\Views\Filters\SelectFilter;

class AdjustmentsTable extends LivewireTableComponent
{
    protected $model = Adjustment::class;

    protected string $tableName = 'adjustments';

    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'adjustments.components.add-button';

    public $status;

    protected $queryString = ['status'];

    public function configure(): void
    {
        $this->setPrimaryKey('id');
        $this->setDefaultSort('created_at', 'desc');
        $this->setQueryStringStatus(false);

        $this->setThAttributes(function (Column $column) {
            if ($column->isField('total_products')) {
                return [
                    'class' => 'd-flex justify-content-center',
                ];
            }
   
            return [
                'class' => 'text-center',
            ];
        });

        $this->setTdAttributes(function (Column $column, $row, $columnIndex, $rowIndex) {
            if (in_array($column->getField(), ['warehouse_id', 'created_on'])) {
                return [
                    'class' => 'text-center',
                ];
            }
            if ($column->getField() == 'total_products') {
                return [
                    'class' => 'text-center',
                ];
            }

            return [
            ];
        });
    }

    public function columns(): array
    {
        return [
            Column::make(__('messages.adjustments.adjustment_reference'), 'reference_code')
            ->sortable()
            ->searchable()
            ->view('adjustments.components.refence'),
            Column::make(__('messages.adjustments.warehouse_adjustment'), 'warehouse.name')
            ->sortable(function (Builder $query, $direction) {
                return $query->orderBy(Warehouse::select('name')->whereColumn('warehouse.id', 'warehouse_id'),
                    $direction);
            })
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return $row->warehouse->name;
            }),
            Column::make(__('messages.adjustments.adjustment_total_products'), 'total_products')
            ->sortable()
            ->searchable()
            ->view('adjustments.components.total'),
            
            Column::make(__('messages.adjustments.adjustment_created_on'), 'created_at')
            ->sortable()
            ->searchable()
            ->view('adjustments.components.created-at'),
            Column::make(__('messages.common.action'), 'id')
            ->format(function ($value, $row, Column $column) {
                return view('livewire.action-button')
                    ->withValue([
                        'edit-route' => route('adjustments.edit', $row->id),
                        'data-id' => $row->id,
                        'data-delete-id' => 'adjustment-delete-btn',
                    ]);
            }),
        ];
    }
    public function filters(): array
    {

        $warehouses = Warehouse::toBase()->pluck('name', 'id')->toArray();

        return [
            SelectFilter::make('Warehouse')
                ->options($warehouses)
                ->filter(function(Builder $builder, string $value) {
                    $builder->where('adjustments.warehouse_id',  $value);
                }),
        ];

    }
    public function builder(): Builder
    {
        return Adjustment::query()->select('adjustments.*');
    }

    public function resetPageTable()
    {
        $this->customResetPage('adjustmentsPage');
    }
}
