@php
$transfer_id = 0;
$from_warehouse_id = 0;
$to_warehouse_id = 0;
if(!empty($transfer->id)) {
    $transfer_id = $transfer->id;
    $from_warehouse_id =  $transfer->from_warehouse_id;
    $to_warehouse_id =  $transfer->to_warehouse_id;
}
@endphp 
<div class="row">
    <div
        class="col-md-4"> {{ Form::label('transfer_date', __('messages.transfers.transfer_date') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('date', $transfer->transfer_date ?? null, ['class' => 'form-control', 'id' => 'transfer_date', 'autocomplete' => 'off', 'required']) }}
    </div>
    <div class="col-md-4 mb-3">
        {{ Form::label('warehouse_id', __('messages.transfers.transfer_from_warehouse') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('from_warehouse_id', $warehouses, $transfer->warehouse_id, ['class' => 'form-select io-select2', 'onchange'=>'livewire.emit("loadWarehouseProduct", this.value)', 'id' => 'from_warehouse_id', 'placeholder' => __('messages.transfers.transfer_choose_from_warehouse'), 'required', 'data-control' => 'select2']) }}
        @if(!empty($warehouse_id))
        <input type="hidden" name="from_warehouse_id" value="{{ $from_warehouse_id }}" />    
        @endif
    </div>
    <div class="col-md-4 mb-3">
        {{ Form::label('warehouse_id', __('messages.transfers.transfer_to_warehouse') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('to_warehouse_id', $warehouses, $transfer->warehouse_id, ['class' => 'form-select io-select2',  'id' => 'to_warehouse_id', 'placeholder' => __('messages.transfers.transfer_choose_to_warehouse'), 'required', 'data-control' => 'select2']) }}
        @if(!empty($warehouse_id))
        <input type="hidden" name="to_warehouse_id" value="{{ $to_warehouse_id }}" />    
        @endif
    </div>
    <livewire:transfer.product-filter></livewire:transfer.product-filter>
    <livewire:transfer.items :transfer_id="$transfer_id"></livewire:transfer.items>
    <div class="col-lg-12">
        <div class="row" style="width: 100%">
            <div class="col-md-4 mb-5">
                {{ Form::label('tax_rate',__('messages.transfers.transfer_order_tax').':', ['class' => 'form-label  mb-3']) }}
                <div class="input-group">
                    {{ Form::text('tax_rate', null, ['id'=>'order_tax','class' => 'form-control form-control-solid amount d-flex','step'=>'any','onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)", 'placeholder'=>__('0.00'),
'onkeyup' => 'livewire.emit("updateOrderTaxDiscountShipping", "tax_rate", this.value)']) }}
                    <span class="input-group-text bg-white"
                          id="autoCode" href="javascript:void(0)"
                          data-toggle="tooltip"
                          data-placement="right" title="Currency Code">
                        %
                    </span>
                </div>
            </div>
            <div class="col-md-4 mb-5">
                {{ Form::label('discount',__('messages.transfers.transfer_discount').':', ['class' => 'form-label  mb-3']) }}
                <div class="input-group">
                    {{ Form::text('discount', null, ['id'=>'discount','class' => 'form-control form-control-solid discount d-flex','step'=>'any','onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)", 'placeholder'=>__('0.00'), 'onkeyup' => 'livewire.emit("updateOrderTaxDiscountShipping", "discount", this.value)']) }}
                    <span class="input-group-text bg-white"
                          data-toggle="tooltip"
                          data-placement="right" title="Currency Code">
                        {{ getCurrencySymbol() }}
                    </span>
                </div>
            </div>
            <div class="col-md-4 mb-5">
                {{ Form::label('shipping',__('messages.transfers.transfer_shipping').':', ['class' => 'form-label  mb-3']) }}
                <div class="input-group">
                    {{ Form::text('shipping', null, ['id'=>'shipping','class' => 'form-control form-control-solid amount d-flex','step'=>'any','onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)",'placeholder'=>__('0.00'),
'onkeyup' => 'livewire.emit("updateOrderTaxDiscountShipping", "shipping", this.value)']) }}
                    <span class="input-group-text bg-white"
                          id="autoCode"
                          data-toggle="tooltip"
                          data-placement="right" title="Currency Code">
                        {{ getCurrencySymbol() }}
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        {{ Form::label('status',__('messages.transfers.transfer_status').':', ['class' => 'form-label required mb-3']) }}
        <div class="input-group">
            {{ Form::select('status', $product_statuses, $client_id ?? null, ['class' => 'form-select io-select2', 'id' => 'client_id', 'placeholder' => __('messages.product.placeholder.status'), 'required', 'data-control' => 'select2']) }}
        </div>
    </div>
    <div class="col-md-12 mb-5 mt-3">
        {{ Form::label('Notes', __('messages.transfers.transfer_notes') . ':', ['class' => 'form-label mb-3']) }}
        {{ Form::textarea('notes', null, ['class' => 'form-control form-control-solid', 'rows' => '4', 'placeholder' => __('messages.transfers.transfer_notes')]) }}
    </div>
</div>

<!-- Submit Field -->
<div class="float-end">
    <div class="form-group col-sm-12">
        <button type="button" name="submit" class="btn btn-primary mx-3" id="saveTransferForm" data-status="0"
                value="0">{{ __('messages.common.save') }}
        </button>
        <a href="{{ route('transfers.index') }}"
           class="btn btn-secondary btn-active-light-primary">{{ __('messages.common.cancel') }}</a>
    </div>
</div>


<script type="text/javascript">
    $(function(e) {
        @if(!empty($from_warehouse_id))
        livewire.emit("loadWarehouseProduct", {{ $from_warehouse_id }});
        @endif

    });
</script>
