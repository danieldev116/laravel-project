<?php

namespace App\Http\Livewire;

use App\Models\Client;
use App\Models\Transfer;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;
use Rappasoft\LaravelLivewireTables\Views\Filters\SelectFilter;

class TransfersTable extends LivewireTableComponent
{
    protected $model = Transfer::class;

    protected string $tableName = 'transfers';

    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'transfers.components.add-button';

    public $status;

    protected $queryString = ['status'];

    public function configure(): void
    {
        $this->setPrimaryKey('id');
        $this->setDefaultSort('created_at', 'desc');
        $this->setQueryStringStatus(false);

        $this->setThAttributes(function (Column $column) {
            if ($column->isField('grand_total')) {
                return [
                    'class' => 'd-flex justify-content-center',
                ];
            }
  
            return [
                'class' => 'text-center',
            ];
        });
        $this->setTdAttributes(function (Column $column, $row, $columnIndex, $rowIndex) {
      
            if ($column->getField() == 'grand_total') {
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
            Column::make(__('messages.transfers.transfer_reference'), 'reference_code')
            ->sortable()
            ->searchable()
            ->view('transfers.components.reference'),
            Column::make(__('messages.transfers.transfer_from_warehouse'), 'from_warehouse_id')
            ->sortable()
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return $row->fromWarehouse->name;
            }),
            Column::make(__('messages.transfers.transfer_to_warehouse'), 'to_warehouse_id')
            ->sortable()
            ->searchable()
            ->format(function ($value, $row, Column $column) {
                return $row->toWarehouse->name;
            }),
            Column::make(__('messages.transfers.transfer_items'), 'to_warehouse_id')
            ->sortable()
            ->searchable(),
            Column::make(__('messages.transfers.transfer_grand_total'), 'grand_total')
            ->sortable()
            ->searchable(),
            Column::make(__('messages.transfers.transfer_status'), 'status')
            ->sortable()
            ->searchable()
            ->view('transfers.components.transfer-status'),
            Column::make(__('messages.transfers.transfer_created_on'), 'created_at')
            ->sortable()
            ->searchable()
            ->view('transfers.components.created-at'),
            Column::make(__('messages.common.action'), 'id')
            ->format(function ($value, $row, Column $column) {
                return view('livewire.action-button')
                    ->withValue([
                        'edit-route' => route('transfers.edit', $row->id),
                        'data-id' => $row->id,
                        'data-delete-id' => 'transfers-delete-btn',
                    ]);
            }),
        ];
    }
    public function builder(): Builder
    {
        return Transfer::query()->select('transfers.*');
    }

    public function filters(): array
    {
        $status = Transfer::OrderStatusses;

        return [
            SelectFilter::make(__('messages.common.status').':')
                ->options($status)
                ->filter(function (Builder $builder, string $value) {
                    $builder->where('transfers.status', '=', $value);
                }),
        ];
    }

    public function resetPageTable()
    {
        $this->customResetPage('transfersPage');
    }
}
