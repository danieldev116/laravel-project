<div class="row">
    <div class="col-lg-4 col-sm-12 mb-5">
        {{ Form::label('client_id', __('messages.supplier.client').(':'),['class' => 'form-label required fs-6 text-gray-700 mb-3']) }}
        {{ Form::select('client_id', $clients, $client_id ?? null, ['class' => 'form-select io-select2', 'id' => 'client_id', 'placeholder' => __('messages.supplier.client'),'required', 'data-control' =>'select2']) }}
    </div>
    <div class="col-lg-4 col-sm-12 mt-1 mb-5">
        <h4 class="align-items-center">{{__('messages.supplier.supplier')}} # <span
                    class="text-gray-500">{{ $supplier->supplier_id }}</span></h4>
        <input type="hidden" id="supplierId" value="{{ $supplier->supplier_id }}" name="supplier_id"/>
    </div>
    <div class="col-lg-4 col-sm-12">
        <div class="mb-5">
            {{ Form::label('status', __('messages.common.status').(':'), ['class' => 'form-label required mb-3']) }}
            {{ Form::select('status', $statusArr, isset($supplier) ? $supplier->status : null, ['class' => 'form-select', 'id' => 'status','required','data-control' =>'select2']) }}
        </div>
    </div>
    <div class="col-lg-4 col-sm-12 mb-5">
        {{ Form::label('supplier_date', __('messages.supplier.supplier_date').(':'),['class' => 'form-label required mb-3']) }}
        {{ Form::text('supplier_date',null ,['class' => 'form-select', 'id' => 'editsupplierDate', 'autocomplete' => 'off','required']) }}
    </div>
    <div class="mb-5 col-lg-4 col-sm-12">
        {{ Form::label('due_date', __('messages.supplier.due_date').(':'),['class' => 'form-label required mb-3']) }}
        {{ Form::text('due_date', null, ['class' => 'form-select edit-supplier-due-date', 'autocomplete' => 'off','required']) }}
    </div>
    <div class="mb-5 col-lg-4 col-sm-12">
        {{ Form::label('templateId', __('messages.setting.invoice_template').(':'),['class' => 'form-label mb-3']) }}
        {{ Form::select('template_id', $template,isset($supplier) ? $supplier->template_id:null, ['class' => 'form-select', 'id' => 'templateId','required', 'data-control' =>'select2']) }}
    </div>
    <div class="mb-0">
        <div class="col-12 text-end mb-lg-10 mb-6">
            <button type="button" class="btn btn-primary text-start"
                    id="addsupplierItem"> {{ __('messages.invoice.add') }}</button>
        </div>
        <div class="table-responsive">
            <table class="table table-striped box-shadow-none mt-4" id="billTbl">
                <thead>
                <tr class="border-bottom fs-7 fw-bolder text-gray-700 text-uppercase">
                    <th scope="col">#</th>
                    <th scope="col" class="required">{{ __('messages.product.product') }}</th>
                    <th scope="col" class="required">{{ __('messages.invoice.qty') }}</th>
                    <th scope="col" class="required">{{ __('messages.product.unit_price') }}</th>
                    <th scope="col" class="required">{{ __('messages.invoice.amount') }}</th>
                    <th scope="col" class="text-end">{{ __('messages.common.action') }}</th>
                </tr>
                </thead>
                <tbody class="supplier-item-container">
                @php
                    $i = 1;
                @endphp
                @foreach($supplier->supplierItems as $supplierItem)
                    <tr class="tax-tr">
                        <td class="text-center item-number align-center">{{ $i++ }}</td>
                        <td class="table__item-desc w-25">
                            {{ Form::select('product_id[]', $products, isset($supplierItem->product_id)?$supplierItem->product_id:$supplierItem->product_name??[], ['class' => 'form-select productId product-supplier io-select2', 'required', 'placeholder'=>'Select Product or Enter free text', 'data-control' => 'select2']) }}
                            {{ Form::hidden('id[]', $supplierItem->id) }}
                        </td>
                        <td class="table__qty">
                            {{ Form::number('quantity[]', $supplierItem->quantity, ['class' => 'form-control qty-supplier' ,'id'=>'qty','required', 'type' => 'number',  'min' => '0', 'step' => '.01','oninput'=>"validity.valid||(value=value.replace(/\D+/g, ''))"]) }}
                        </td>
                        <td>
                            {{ Form::number('price[]', $supplierItem->price, ['class' => 'form-control price-input price-supplier','oninput'=>"validity.valid||(value=value.replace(/[e\+\-]/gi,''))",'min'=>'0','step'=>'.01','required','onKeyPress'=>'if(this.value.length==8) return false;']) }}
                        </td>
                        <td class="supplier-item-total pt-8 text-nowrap">
                            {{ number_format($supplierItem->total, 2) }}
                        </td>
                        <td class="text-end">
                            <button type="button" title="Delete"
                                    class="btn btn-icon fs-3 text-danger btn-active-color-danger delete-supplier-item">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col-lg-7 col-sm-12 mt-2 mt-lg-0 align-right-for-full-screen">
                <div class="mb-2 col-xl-6 col-lg-8 col-sm-12 float-right">
                    {{ Form::label('discount', __('messages.invoice.discount').(':'), ['class' => 'form-label mb-1']) }}
                    <div class="input-group">
                        {{ Form::number('discount',isset($supplier) ? $supplier->discount : 0, ['id'=>'discount','class' => 'form-control ','oninput'=>"validity.valid||(value=value.replace(/[e\+\-]/gi,''))",'min'=>'0','value'=>'0','step'=>'.01','pattern'=>"^\d*(\.\d{0,2})?$"]) }}
                        <div class="input-group-append" style="width: 210px !important;">
                            {{ Form::select('discount_type', $discount_type, isset($supplier) ? $supplier->discount_type : 0, ['class' =>'form-select io-select2', 'id' => 'discountType','data-control' => "select2"]) }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xxl-3 col-lg-5 col-md-6 ms-md-auto mt-4 mb-lg-10 mb-6">
                <div class="border-top">
                    <table class="table table-borderless box-shadow-none mb-0 mt-5">
                        <tbody>
                        <tr>
                            <td class="ps-0">{{ __('messages.invoice.sub_total').(':') }}</td>
                            <td class="text-gray-900 text-end pe-0">
                                @if(!getSettingValue('currency_after_amount'))
                                    <span>{{ getCurrencySymbol()  }}</span>@endif <span id="supplierTotal" class="price">
                                    {{ isset($supplier) ? number_format($supplier->amount,2) : 0 }}
                            </span>
                                @if(getSettingValue('currency_after_amount'))
                                    <span>{{ getCurrencySymbol()  }}</span>@endif
                            </td>
                        </tr>
                        <tr>
                            <td class="ps-0">{{ __('messages.invoice.discount').(':') }}</td>
                            <td class="text-gray-900 text-end pe-0">
                                @if(!getSettingValue('currency_after_amount'))
                                    <span>{{ getCurrencySymbol()  }}</span>@endif <span id="supplierDiscountAmount">
                                @if(isset($supplier) && $supplier->discount_type == \App\Models\Invoice::FIXED)
                                        {{ $supplier->discount ?? 0 }}
                                    @else
                                        {{ isset($supplier) ? number_format($supplier->amount * $supplier->discount / 100,2) : 0 }}
                                    @endif
                            </span>
                                @if(getSettingValue('currency_after_amount'))
                                    <span>{{ getCurrencySymbol()  }}</span>@endif
                            </td>
                        </tr>
                        <tr>
                            <td class="ps-0">{{ __('messages.invoice.total').(':') }}</td>
                            <td class="text-gray-900 text-end pe-0">
                                @if(!getSettingValue('currency_after_amount'))
                                    <span>{{ getCurrencySymbol() }}</span>@endif <span id="supplierFinalAmount">
                                    {{ isset($supplier) ? number_format($supplier->amount - ($supplier->amount * $supplier->discount / 100),2) : 0 }}
                                </span>
                                @if(getSettingValue('currency_after_amount'))
                                    <span>{{ getCurrencySymbol()  }}</span>@endif
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <br>
        <div class="row justify-content-left">
            <div class="ol-lg-12 col-md-12 col-sm-12 end justify-content-left mt-5 mb-5">
                <button type="button" class="btn btn-primary note" id="supplierAddNote">
                    <i class="fas fa-plus"></i> {{ __('messages.invoice.add_note_term') }}
                </button>
                <button type="button" class="btn btn-danger note" id="supplierRemoveNote">
                    <i class="fas fa-minus"></i> {{ __('messages.invoice.remove_note_term') }}
                </button>
            </div>
            <div class="col-lg-6 mt-5 mb-5" id="supplierNoteAdd">
                {{ Form::label('note', __('messages.invoice.note').(':'),['class' => 'form-label fs-6 fw-bolder text-gray-700 mb-3']) }}
                {{ Form::textarea('note',isset($supplier) ? $supplier->note : null,['class'=>'form-control','id'=>'supplierNote','rows' => '5']) }}
            </div>
            <div class="col-lg-6 mt-5 mb-5" id="supplierTermRemove">
                {{ Form::label('term', __('messages.invoice.terms').(':'),['class' => 'form-label fs-6 fw-bolder text-gray-700 mb-3']) }}
                {{ Form::textarea('term',isset($supplier) ? $supplier->term : null,['class'=>'form-control','id'=>'supplierTerm','rows' => '5']) }}
            </div>
        </div>
    </div>
</div>
<!-- Total Amount Field -->
{{ Form::hidden('amount', isset($supplier) ? number_format($supplier->amount - ($supplier->amount * $supplier->discount / 100),2) : 0, ['class' => 'form-control', 'id' => 'supplierTotalAmount']) }}
<!-- Submit Field -->
<div class="float-end">
    <div class="form-group col-sm-12">
        <button type="button" name="save" class="btn btn-primary mx-3" id="editSavesupplier" data-status="0"
                value="0">{{ __('messages.common.save') }}
        </button>
        <a href="{{ route('invoices.index') }}"
           class="btn btn-secondary btn-active-light-primary">{{ __('messages.common.cancel') }}</a>
    </div>
</div>
