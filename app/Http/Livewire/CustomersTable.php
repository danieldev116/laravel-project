<?php

namespace App\Http\Livewire;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Builder;
use Rappasoft\LaravelLivewireTables\Views\Column;
use Rappasoft\LaravelLivewireTables\Views\Filters\SelectFilter;

class CustomersTable extends LivewireTableComponent
{
    protected $model = Customer::class;

    protected string $tableName = 'customers';

    public bool $showButtonOnHeader = true;

    public string $buttonComponent = 'customers.components.add-button';

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
            // if ($column->getField() == 'name') {
            //     return [
            //         'class' => 'text-end',
            //     ];
            // }

            return [
            ];
        });
    }

    public function columns(): array
    {
        return [

            Column::make(__('messages.customers.customer_customer'), 'name')
            ->sortable()
            ->searchable(),
            Column::make(__('messages.customers.customer_phone_number'), 'phone')
            ->sortable()
            ->searchable(),
            Column::make(__('messages.customers.customer_created'), 'created_at')
            ->sortable()
            ->searchable(),
            Column::make(__('messages.common.action'), 'id')
            ->format(function ($value, $row, Column $column) {
                return view('livewire.action-button')
                    ->withValue([
                        'edit-route' => route('customers.edit', $row->id),
                        'data-id' => $row->id,
                        'data-delete-id' => 'customers-delete-btn',
                    ]);
            }),
        ];
    }

    public function builder(): Builder
    {
        return Customer::query()->select('customers.*');
        // $status = request()->input('status', null);
        // $query = Quote::with(['client', 'client.user', 'client.user.media'])->select('quotes.*')
        //     ->when($status, function ($query, $status) {
        //         return $query->where('quotes.status', $status);
        //     })
        //     ->when($this->getAppliedFilterWithValue('quotes.status'), function ($query, $type) {
        //         return $query->where('quotes.status', $type);
        //     });

        // return $query;
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
        $this->customResetPage('supplierssPage');
    }
}
