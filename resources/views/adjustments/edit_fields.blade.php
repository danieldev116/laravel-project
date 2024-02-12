<div class="row">
    <div class="col-lg-4 col-sm-12 mb-5">
        {{ Form::label('warehouse_id', __('messages.adjustments.warehouse_adjustment') . ':', ['class' => 'form-label required mb-3']) }}
        {{-- {{ Form::select('warehouse_id', null, ['class' => 'form-select io-select2', 'id' => 'edit_adjustment_warehouse_id', 'placeholder' => __('messages.adjustments.warehouse_adjustment'), 'required', 'data-control' => 'select2']) }} --}}
        {{ Form::text('warehouse_id', $adjustment->warehouse['name'], ['id'=>'edit_warehouse_id','class' => 'form-control form-control-solid','required','placeholder' => __('messages.adjustments.warehouse_adjustment')]) }}
        <span style="visibility: hidden" id="adjustment_warehouse_warning">Please select warehouse</span>
    </div>
    <div class="col-lg-4 col-sm-12 mb-5">
        {{ Form::label('adjustment_date', __('messages.adjustments.adjustment_date').(':'),['class' => 'form-label required mb-3']) }}
        {{ Form::text('date', null, ['class' => 'form-select', 'id' => 'edit_adjustment_date', 'autocomplete' => 'off','required','data-focus'=>"false"]) }}
    </div>

<div class="col-lg-12 col-sm-12">
    {{ Form::label('Product', __('messages.adjustments.adjustment_product') . ':', ['class' => 'form-label required mb-3']) }}
    <div class="d-flex align-items-center position-relative my-1">
        <span class="svg-icon svg-icon-1 position-absolute ms-6">
            <svg xmlns="https://www.w3.org/2000/svg" width="24px"
                 height="24px" viewBox="0 0 24 24" version="1.1">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="0" y="0" width="24" height="24"/>
                    <path d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                          fill="#000000" fill-rule="nonzero" opacity="0.3"/>
                    <path d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                          fill="#000000" fill-rule="nonzero"/>
                </g>
            </svg>
        </span>
        <!--end::Svg Icon-->
        <input type="search" data-datatable-filter="search" name="search" id="edit_id_search_by_product_code"
               class="form-control w-250px ps-14" placeholder={{ __('messages.adjustments.adjustment_search_product_by_code_name') }}/>
    </div>
</div>

<div class="row">
    {{ Form::label('Order items:*', __('messages.adjustments.adjustment_order_items') . ':', ['class' => 'form-label required mb-3']) }}
    <div class="table-responsive">
        <table class="table table-striped box-shadow-none mt-4" id="billTbl">
            <thead>
                <tr class="border-bottom fs-7 fw-bolder text-gray-700 text-uppercase">
                    <th scope="col">#</th>
                    <th scope="col" class="required">{{ __('messages.adjustments.adjustment_column_product') }}</th>
                    <th scope="col" class="required">{{ __('messages.adjustments.adjustment_column_code_product') }}</th>
                    <th scope="col" class="required">{{ __('messages.adjustments.adjustment_column_stock') }}</th>
                    <th scope="col" class="required">{{ __('messages.adjustments.adjustment_column_qty') }}</th>
                    <th scope="col" class="required">{{ __('messages.adjustments.adjustment_column_type') }}</th>
                    <th scope="col" class="required">{{ __('messages.adjustments.adjustment_column_action') }}</th>
                </tr>
            </thead>
            <tbody class="adjustment-item-container" id="edit_id_adjustment_tbody">
                
             {{-- @foreach($adjustment->adjustment_items as $adjustmentItem)
             <tr class="tax-tr">
                 <td class="text-center item-number align-center">{{ $i++ }}</td>
                 <td class="table__item-desc w-25">
         
                 </td>
                 <td class="table__qty">
                     {{ Form::number('quantity[]', $adjustmentItem->quantity, ['class' => 'form-control qty-quote' ,'id'=>'qty','required', 'type' => 'number',  'min' => '0', 'step' => '.01','oninput'=>"validity.valid||(value=value.replace(/\D+/g, ''))"]) }}
                 </td>
                 <td>
                 </td>
                 <td class="quote-item-total pt-8 text-nowrap">
                 </td>
                 <td class="text-end">
                     <button type="button" title="Delete"
                             class="btn btn-icon fs-3 text-danger btn-active-color-danger delete-quote-item">
                         <i class="fa-solid fa-trash"></i>
                     </button>
                 </td>
             </tr>
         @endforeach --}}
            </tbody>
        </table>
    </div>

   
</div>

</div>

<!-- Total Amount Field -->
{{-- {{ Form::hidden('amount', 0, ['class' => 'form-control', 'id' => 'adjustmentTotalAmount']) }} --}}

<!-- Submit Field -->
<div class="float-end">
<div class="form-group col-sm-12">
    <button type="button" name="draft" class="btn btn-primary mx-3" id="editSaveAsDraftadjustment" data-status="0"
        value="0">{{ __('messages.common.save') }}
    </button>
    <a href="{{ route('adjustments.index') }}"
        class="btn btn-secondary btn-active-light-primary">{{ __('messages.common.cancel') }}</a>
</div>
</div>
<style>
.bg-light-warning {
background-color: #fff1d3;
color: #ffb821;
}
</style>
