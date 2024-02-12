@php
$purchase_id = 0;
$warehouse_id = 0;
if(!empty($purchase->id)) {
    $purchase_id = $purchase->id;
    $warehouse_id =  $purchase->warehouse_id;
}
@endphp 

<div class="row">
    <div
        class="col-md-4"> {{ Form::label('purchase_date', __('messages.purchases.purchase_date') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('date', $purchase->purchase_date ?? null, ['class' => 'form-control', 'id' => 'purchase_date', 'autocomplete' => 'off', 'required']) }}
    </div>
    <div class="col-md-4 mb-3">
        {{ Form::label('warehouse_id', __('messages.purchases.warehouse_purchase') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('warehouse_id', $warehouses, $purchase->warehouse_id, ['class' => 'form-select io-select2', 'disabled'=>!empty($warehouse_id), 'onchange'=>'livewire.emit("loadWarehouseProduct", this.value)', 'id' => 'warehouse_id', 'placeholder' => __('messages.purchases.purchase_choose_warehouse'), 'required', 'data-control' => 'select2']) }}
        @if(!empty($warehouse_id))
        <input type="hidden" name="warehouse_id" value="{{ $warehouse_id }}" />    
        @endif
    </div>
    <div class="col-md-4 mb-3">
        {{ Form::label('supplier_id', __('messages.purchases.supplier_purchase') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('supplier_id', $suppliers, $purchase->supplier_id, ['class' => 'form-select io-select2', 'id' => 'supplier_id', 'placeholder' => __('messages.purchases.purchase_choose_supplier'), 'required', 'data-control' => 'select2']) }}
    </div>
    <livewire:purchase.products-filter></livewire:purchase.products-filter>
    <livewire:purchase.items :purchase_id="$purchase_id"></livewire:purchase.items>

    <div class="col-lg-12">
        <div class="row" style="width: 100%">
            <div class="col-md-4 mb-5">
                {{ Form::label('tax_rate',__('messages.purchases.purchase_order_tax').':', ['class' => 'form-label  mb-3']) }}
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
                {{ Form::label('discount',__('messages.purchases.purchase_discount').':', ['class' => 'form-label  mb-3']) }}
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
                {{ Form::label('shipping',__('messages.purchases.purchase_shipping').':', ['class' => 'form-label  mb-3']) }}
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
        {{ Form::label('status',__('messages.purchases.purchase_status').':', ['class' => 'form-label required mb-3']) }}
        <div class="input-group">
            {{ Form::select('status', $product_statuses, null, ['class' => 'form-select io-select2', 'id' => 'status_id', 'placeholder' => __('messages.product.placeholder.status'), 'required', 'data-control' => 'select2']) }}
        </div>
    </div>
    <div class="col-md-12 mb-5 mt-3">
        {{ Form::label('Notes', __('messages.purchases.purchase_notes') . ':', ['class' => 'form-label mb-3']) }}
        {{ Form::textarea('notes', null, ['class' => 'form-control form-control-solid', 'rows' => '4', 'placeholder' => __('messages.purchases.purchase_notes')]) }}
    </div>
</div>

<!-- Submit Field -->
<div class="float-end">
    <div class="form-group col-sm-12">
        <button type="button" name="submit" class="btn btn-primary mx-3" id="savePurchaseForm" data-status="0"
                value="0">{{ __('messages.common.save') }}
        </button>
        <a href="{{ route('purchases.index') }}"
           class="btn btn-secondary btn-active-light-primary">{{ __('messages.common.cancel') }}</a>
    </div>
</div>

<script type="text/javascript">
    $(function(e) {
        @if(!empty($warehouse_id))
        livewire.emit("loadWarehouseProduct", {{ $warehouse_id }});
        @endif

    });
</script>
