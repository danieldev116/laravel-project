<div class="row">
   
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('name', __('messages.customers.customer_name').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('name', null, ['id'=>'name','class' => 'form-control form-control-solid','required','placeholder' => __('messages.customers.customer_input_name')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('email', __('messages.customers.customer_email').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('email', null, ['id'=>'email','class' => 'form-control form-control-solid','required','placeholder' => __('messages.customers.customer_input_email')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('phone_number', __('messages.customers.customer_phone_number').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('phone', null, ['id'=>'phone','class' => 'form-control form-control-solid','required','placeholder' => __('messages.customers.customer_input_phone_number')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('dob', __('messages.customers.customer_dob') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('dob', null, ['class' => 'form-select', 'id' => 'dob', 'autocomplete' => 'off', 'required']) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('country', __('messages.customers.customer_country').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('country', null, ['id'=>'country','class' => 'form-control form-control-solid','required','placeholder' => __('messages.customers.customer_input_country')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('city', __('messages.customers.customer_city').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('city', null, ['id'=>'city','class' => 'form-control form-control-solid','required','placeholder' => __('messages.customers.customer_input_city')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('zip_code', __('messages.customers.customer_address').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('address', null, ['id'=>'address','class' => 'form-control form-control-solid','required','placeholder' => __('messages.customers.customer_input_address')]) }}
    </div>

   
 

</div>


<!-- Submit Field -->
<div class="float-end">
    <div class="form-group col-sm-12">
        <button type="button" name="draft" class="btn btn-primary mx-3" id="saveAsDraftCustomer" data-status="0"
            value="0">{{ __('messages.common.save') }}
        </button>
        <a href="{{ route('customers.index') }}"
            class="btn btn-secondary btn-active-light-primary">{{ __('messages.common.cancel') }}</a>
    </div>
</div>
