<?php

namespace App\Http\Livewire;

use App\Models\Purchase;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;
use Rappasoft\LaravelLivewireTables\Views\Filters\SelectFilter;

class PurchasesTable extends LivewireTableComponent
{
    protected $model = Purchase::class;

    protected string $tableName = 'purchases';

    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'purchases.components.add-button';

    public $status;

    protected $queryString = ['status'];
   

    public function configure(): void
    {
        $this->setPrimaryKey('id');
        $this->setDefaultSort('purchases.created_at', 'desc');
        $this->setQueryStringStatus(false);

        

        $this->setThAttributes(function (Column $column) {
            if ($column->isField('final_amount')) {
                return [
                    'class' => 'd-flex justify-content-end',
                ];
            }

            return [
                'class' => 'text-center',
            ];
        });

        $this->setTdAttributes(function (Column $column, $row, $columnIndex, $rowIndex) {
            if (in_array($column->getField(), ['amount', 'status', 'id'])) {
                return [
                    'class' => 'text-center',
                ];
            }
            if ($column->getField() == 'final_amount') {
                return [
                    'class' => 'text-end',
                ];
            }

            return [
            ];
        });

        $this->setFooterTdAttributes(function(Column $column, $rows)
        {
            if (in_array($column->getField(), ['reference_code', 'grand_total'])) {
                return [
                    'class' => 'fw-bold fs-4',
                    'style' =>'font-weight:bold !important'
                ];
            }

            return [
            ];
        });
    }

    public function columns(): array
    {
        return [
            Column::make(__('messages.purchases.reference_code'), 'reference_code')
            ->sortable()
            ->searchable()
            ->view('purchases.components.refence')
            ->footer(function($rows) {
                return 'Total';
            }),
            Column::make(__('messages.purchases.supplier_purchase'), 'supplier.name')
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return $row->supplier->name;
            }),
            Column::make(__('messages.purchases.warehouse_purchase'), 'warehouse.name')
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return $row->warehouse->name;
            }),
            Column::make(__('messages.common.status'), 'status')
                ->searchable()
                ->view('purchases.components.purchase-status'),
            Column::make(__('messages.purchases.purchase_grand_total'), 'grand_total')
            ->sortable()
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return getCurrencySymbol()." ".numberFormat($row->grand_total);
            })
            ->footer(function($rows) {
                return getCurrencySymbol()." ".numberFormat($rows->sum('grand_total'));
            }),
            Column::make(__('messages.common.payment_type'), 'payment_type')
            ->searchable()
            ->view('purchases.components.payment-type'),
            Column::make(__('messages.purchases.created_on'), 'created_at')
            ->sortable()
            ->searchable()
            ->view('purchases.components.created-at'),
            Column::make(__('messages.common.action'), 'id')
                ->view('livewire.purchase.action-button'),
        ];
    }

    public function builder(): Builder
    {
        $status = request()->input('status', null);
        $query = Purchase::with(['supplier',])->select('purchases.*');

        return $query;
    }

    public function filters(): array
    {

        $statusArr = Purchase::OrderStatusses;

        return [
            SelectFilter::make('Status')
                ->options($statusArr)
                ->filter(function(Builder $builder, string $value) {
                    $builder->where('purchases.status',  $value);
                }),
        ];

    }

    public function resetPageTable()
    {
        $this->customResetPage('purchasePage');
    }
}
