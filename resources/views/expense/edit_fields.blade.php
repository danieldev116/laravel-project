
<div class="row">
    <input type="hidden" id="expenses_edit_Id" value="{{ $expense->id }}" name="expenses_id"/>

    <div class="col-lg-6 col-sm-12 mb-5"> {{ Form::label('expense_date', __('messages.expenses.expense_date') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('date',  null, ['class' => 'form-control', 'id' => 'expense_date', 'autocomplete' => 'off', 'required']) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('title', __('messages.expenses.expense_title').':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('title', null, ['id'=>'expense_title','class' => 'form-control form-control-solid','required','placeholder' => __('messages.expenses.expense_enter_title')]) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('warehouse_id', __('messages.expenses.expense_warehouse') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('warehouse_id', $warehouses,  ['class' => 'form-select io-select2', 'id' => 'expense_warehouse_id', 'placeholder' => __('messages.expenses.expense_choose_warehouse'), 'required', 'data-control' => 'select2']) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('expense_category_id', __('messages.expenses.expense_category') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('expense_category_id', $expense_category,  ['class' => 'form-select io-select2', 'id' => 'expense_category_id', 'placeholder' => __('messages.expenses.expense_choose_category'), 'required', 'data-control' => 'select2']) }}
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">
        {{ Form::label('amount', __('messages.expenses.expense_amount') . ':', ['class' => 'form-label  mb-3']) }}
        <div class="input-group">
            {{ Form::text('amount',null, ['class' => 'form-control form-control-solid', 'placeholder' => __('messages.expenses.expense_amount'), 'id' => 'amount', 'onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)"]) }}
            <span class="input-group-text">$</span>
        </div>
    </div>
    <div class="col-lg-6 col-sm-12 mb-5">   
        {{ Form::label('details', __('messages.expenses.expense_details') . ':', ['class' => 'form-label mb-3']) }}
        {{ Form::textarea('details', null, ['class' => 'form-control form-control-solid', 'rows' => '4', 'placeholder' => __('messages.expenses.expense_enter_details')]) }}
    </div>
</div>


<!-- Submit Field -->
<div class="float-end">
    <div class="form-group col-sm-12">
        <button type="submit" name="draft" class="btn btn-primary mx-3" id="editSaveExpense" data-status="0"
            value="0">{{ __('messages.common.save') }}
        </button>
        <a href="{{ route('expenses.index') }}"
            class="btn btn-secondary btn-active-light-primary">{{ __('messages.common.cancel') }}</a>
    </div>
</div>


