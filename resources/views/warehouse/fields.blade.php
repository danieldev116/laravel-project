<div class="row">
   
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('name', __('messages.warehouse.warehouse_name').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('name', null, ['id'=>'warehouse_name','class' => 'form-control form-control-solid','required','placeholder' => __('messages.warehouse.warehouse_input_name')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('email', __('messages.warehouse.warehouse_email').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('email', null, ['id'=>'warehouse_email','class' => 'form-control form-control-solid','required','placeholder' => __('messages.warehouse.warehouse_input_email')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('phone_number', __('messages.warehouse.warehouse_phone_number').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('phone', null, ['id'=>'warehouse_phone_number','class' => 'form-control form-control-solid','required','placeholder' => __('messages.warehouse.warehouse_input_phone_number')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('country', __('messages.warehouse.warehouse_country').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('country', null, ['id'=>'warehouse_country','class' => 'form-control form-control-solid','required','placeholder' => __('messages.warehouse.warehouse_input_country')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('city', __('messages.warehouse.warehouse_city').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('city', null, ['id'=>'warehouse_city','class' => 'form-control form-control-solid','required','placeholder' => __('messages.warehouse.warehouse_input_city')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('zip_code', __('messages.warehouse.warehouse_zip_code').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('zip_code', null, ['id'=>'warehouse_zip_code','class' => 'form-control form-control-solid','required','placeholder' => __('messages.warehouse.warehouse_input_zip_code')]) }}
    </div>

   
 

</div>


<!-- Submit Field -->
<div class="float-end">
    <div class="form-group col-sm-12">
        <button type="submit" name="draft" class="btn btn-primary mx-3" id="saveAsDraftWarehouse" data-status="0"
            value="0">{{ __('messages.common.save') }}
        </button>
        <a href="{{ route('warehouse.index') }}"
            class="btn btn-secondary btn-active-light-primary">{{ __('messages.common.cancel') }}</a>
    </div>
</div>

