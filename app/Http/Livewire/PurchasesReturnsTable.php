<?php

namespace App\Http\Livewire;

use App\Models\PurchaseReturn;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;
use Rappasoft\LaravelLivewireTables\Views\Filters\SelectFilter;

class PurchasesReturnsTable extends LivewireTableComponent
{
    protected $model = PurchaseReturn::class;

    protected string $tableName = 'purchases_return';

    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'purchases-returns.components.add-button';

    public $status;

    protected $queryString = ['status'];
   

    public function configure(): void
    {
        $this->setPrimaryKey('id');
        $this->setDefaultSort('purchases_return.created_at', 'desc');
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
            ->view('purchases-returns.components.refence'),
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
                ->view('purchases-returns.components.purchase-status'),
            Column::make(__('messages.purchases.purchase_grand_total'), 'grand_total')
            ->sortable()
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return getCurrencySymbol()." ".numberFormat($row->grand_total);
            }),
            Column::make(__('messages.purchases.purchase_paid'), 'paid_amount')
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return getCurrencySymbol()." ".numberFormat($row->paid_amount ?? 0);
            }),
            Column::make(__('messages.purchases.purchase_due'), 'received_amount')
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return getCurrencySymbol()." ".numberFormat($row->received_amount ?? 0);
            }),
            Column::make(__('messages.common.payment_type'), 'payment_type')
            ->searchable()
            ->view('purchases-returns.components.payment-type'),
            Column::make(__('messages.purchases.created_on'), 'created_at')
            ->sortable()
            ->searchable()
            ->view('purchases.components.created-at'),
            Column::make(__('messages.common.action'), 'id')
                ->view('livewire.purchase-return.action-button'),
        ];
    }

    public function builder(): Builder
    {
        $status = request()->input('status', null);
        $query = PurchaseReturn::with(['supplier',])->select('purchases_return.*');

        return $query;
    }

    public function filters(): array
    {

        $statusArr = PurchaseReturn::OrderStatusses;

        return [
            SelectFilter::make('Status')
                ->options($statusArr)
                ->filter(function(Builder $builder, string $value) {
                    $builder->where('purchases_return.status',  $value);
                }),
        ];

    }

    public function resetPageTable()
    {
        $this->customResetPage('purchaseReturnPage');
    }
}
