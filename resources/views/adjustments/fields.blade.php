@php
$warehouse_id = 0;
$adjustment_id = 0;
if(!empty($adjustment->id)) {
    $warehouse_id =  $adjustment->warehouse_id;
    $adjustment_id = $adjustment->id;
    
}

@endphp 

<div class="row">
    <div class="col-md-4 mb-3">
        {{ Form::label('warehouse_id', __('messages.adjustments.warehouse_adjustment') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('warehouse_id', $warehouses, $adjustment->warehouse_id, ['class' => 'form-select io-select2', 'disabled'=>!empty($warehouse_id), 'onchange'=>'livewire.emit("loadWarehouseProduct", this.value)', 'id' => 'warehouse_id', 'placeholder' => __('messages.adjustments.adjustment_choose_warehouse'), 'required', 'data-control' => 'select2']) }}
        @if(!empty($warehouse_id))
        <input type="hidden" name="warehouse_id" value="{{ $warehouse_id }}" />    
        @endif
    </div>
    <div
        class="col-md-4"> {{ Form::label('adjustment_date', __('messages.adjustments.adjustment_date') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('date', $adjustment->adjustment_date ?? null, ['class' => 'form-control', 'id' => 'adjustment_date', 'autocomplete' => 'off', 'required']) }}
    </div>


    <livewire:adjustment.products-filter></livewire:adjustment.products-filter>
    <livewire:adjustment.items :adjustment_id="$adjustment_id"></livewire:adjustment.items>

    
</div>

<!-- Submit Field -->
<div class="float-end">
    <div class="form-group col-sm-12">
        <button type="button" name="submit" class="btn btn-primary mx-3" id="saveAdjustmentForm" data-status="0"
                value="0">{{ __('messages.common.save') }}
        </button>
        <a href="{{ route('adjustments.index') }}"
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
