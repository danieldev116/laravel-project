<div class="row">
    <div class="col-lg-4 col-sm-12 mb-5">
        {{ Form::label('sale_date', __('messages.sales.sale_date') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('sale_date', null, ['class' => 'form-select', 'id' => 'sale_date', 'autocomplete' => 'off', 'required']) }}
    </div>
    <div class="col-lg-4 col-sm-12 mb-5">
        {{ Form::label('client_id', __('messages.sales.warehouse_sale') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('client_id', $clients, $client_id ?? null, ['class' => 'form-select io-select2', 'id' => 'client_id', 'placeholder' => __('messages.sales.sale_choose_warehouse'), 'required', 'data-control' => 'select2']) }}
    </div>
    <div class="col-lg-4 col-sm-12 mb-5">
        {{ Form::label('client_id', __('messages.sales.customer_sale') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('client_id', $clients, $client_id ?? null, ['class' => 'form-select io-select2', 'id' => 'client_id', 'placeholder' => __('messages.sales.sale_choose_customer'), 'required', 'data-control' => 'select2']) }}
    </div>
   
    <div class="col-lg-12 col-sm-12">
        {{ Form::label('Product', __('messages.sales.sale_product') . ':', ['class' => 'form-label required mb-3']) }}
        <div class="d-flex align-items-center position-relative my-1">
            <!--begin::Svg Icon | path: icons/duotone/General/Search.svg-->
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
            <input type="search" data-datatable-filter="search" name="search"
                   class="form-control w-250px ps-14" placeholder={{__('messages.sales.sale_search_product_by_code_name')}}/>
        </div>
    </div>
   
    {{-- <div class="col-lg-4 col-sm-12 mb-5">
        {{ Form::label('quote_id', __('messages.quote.quote') . ' #', ['class' => 'form-label mb-3']) }}
        {{ Form::text('quote_id', \App\Models\Quote::generateUniqueQuoteId(), ['class' => 'form-control', 'required', 'id' => 'quoteId', 'maxlength' => 6, 'onkeypress' => 'return blockSpecialChar(event)']) }}
    </div> --}}
    {{-- <div class="form-group col-lg-4 col-sm-12 mb-5 ">
        {{ Form::label('amount',__('messages.invoice.amount').':', ['class' => 'form-label required mb-3']) }}
        <div class="input-group">
            {{ Form::number('amount', null, ['id'=>'amount','class' => 'form-control form-control-solid amount d-flex','step'=>'any','oninput'=>"validity.valid||(value=value.replace(/[e\+\-]/gi,''))",'min'=>'0','pattern'=>"^\d*(\.\d{0,2})?$",'required','placeholder'=>__('messages.invoice.amount')]) }}
            <a class="input-group-text bg-secondary border-0 text-decoration-none invoice-currency-code" id="autoCode" href="javascript:void(0)"
               data-toggle="tooltip"
               data-placement="right" title="Currency Code">
                {{ getCurrencySymbol() }}
            </a>
        </div>
    </div>
    <div class="mb-5 col-lg-4 col-sm-12">
        {{ Form::label('due_date', __('messages.quote.due_date') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::text('due_date', null, ['class' => 'form-select', 'id' => 'quoteDueDate', 'autocomplete' => 'off', 'required']) }}
    </div>
   
    <div class="mb-5 col-lg-4 col-sm-12">
        {{ Form::label('templateId', __('messages.setting.invoice_template') . ':', ['class' => 'form-label mb-3']) }}
        {{ Form::select('template_id', $template, \App\Models\Setting::DEFAULT_TEMPLATE ?? null, ['class' => 'form-select', 'id' => 'templateId', 'required', 'data-control' => 'select2']) }}
    </div> --}}
    <div class="row">
        {{ Form::label('Order items:*', __('messages.sales.sale_order_items') . ':', ['class' => 'form-label required mb-3']) }}
        <div class="table-responsive">
            <table class="table table-striped box-shadow-none mt-4" id="billTbl">
                <thead>
                    <tr class="border-bottom fs-7 fw-bolder text-gray-700 text-uppercase">
                        <th scope="col">#</th>
                        <th scope="col" class="required">{{ __('messages.sales.sale_column_product') }}</th>
                        <th scope="col" class="required">{{ __('messages.sales.sale_column_net_unit_cost') }}</th>
                        <th scope="col" class="required">{{ __('messages.sales.sale_column_stock') }}</th>
                        <th scope="col" class="required">{{ __('messages.sales.sale_column_qty') }}</th>
                        <th scope="col" class="required">{{ __('messages.sales.sale_column_discount') }}</th>
                        <th scope="col" class="required">{{ __('messages.sales.sale_column_tax') }}</th>
                        <th scope="col" class="required">{{ __('messages.sales.sale_column_subtotal') }}</th>
                        <th scope="col" class="required">{{ __('messages.sales.sale_column_action') }}</th>
                    </tr>
                </thead>
                <tbody class="quote-item-container">
                    <tr class="tax-tr">
                        <td class="text-center item-number align-center">1</td>
                        <td class="table__item-desc w-25">
                            {{ Form::select('product_id[]', $products, null, ['class' => 'form-select product-quote io-select2', 'required', 'placeholder' => __('messages.quote.select_product'), 'data-control' => 'select2']) }}
                        </td>
                        <td class="table__qty">
                            {{ Form::number('quantity[]', null, ['class' => 'form-control qty-quote', 'required', 'type' => 'number', 'min' => '0', 'step' => '.01', 'oninput' => "validity.valid||(value=value.replace(/[e\+\-]/gi,''))"]) }}
                        </td>
                        <td>
                            {{ Form::number('price[]', null, ['class' => 'form-control price-input price-quote', 'oninput' => "validity.valid||(value=value.replace(/[e\+\-]/gi,''))", 'min' => '0', 'value' => '0', 'step' => '.01', 'pattern' => "^\d*(\.\d{0,2})?$", 'required', 'onKeyPress' => 'if(this.value.length==8) return false;']) }}
                        </td>
                        <td class="table__item-desc w-25">
                            {{ Form::select('product_id[]', $products, null, ['class' => 'form-select product-quote io-select2', 'required', 'placeholder' => __('messages.quote.select_product'), 'data-control' => 'select2']) }}
                        </td>
                        <td class="table__item-desc w-25">
                            {{ Form::select('product_id[]', $products, null, ['class' => 'form-select product-quote io-select2', 'required', 'placeholder' => __('messages.quote.select_product'), 'data-control' => 'select2']) }}
                        </td>
                        <td class="table__item-desc w-25">
                            {{ Form::select('product_id[]', $products, null, ['class' => 'form-select product-quote io-select2', 'required', 'placeholder' => __('messages.quote.select_product'), 'data-control' => 'select2']) }}
                        </td>
                        <td class="quote-item-total pt-8 text-nowrap">
                            @if (!getSettingValue('currency_after_amount'))
                                <span>{{ getCurrencySymbol() }}</span>
                            @endif
                            0.00 @if (getSettingValue('currency_after_amount'))
                                <span>{{ getCurrencySymbol() }}</span>
                            @endif
                        </td>
                        <td class="text-end">

                            <button type="button" title="Delete"
                                class="btn btn-icon fs-3 text-danger btn-active-color-danger delete-quote-item">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row">
            <div class="col-lg-7 col-sm-12 mt-2 mt-lg-0 align-right-for-full-screen">
                {{-- <div class="mb-2 col-xl-6 col-lg-8 col-sm-12 float-right">
                    {{ Form::label('discount', __('messages.sales.discount') . ':', ['class' => 'form-label mb-1']) }}
                    <div class="input-group">
                        {{ Form::number('discount', 0, ['id' => 'discount', 'class' => 'form-control ', 'oninput' => "validity.valid||(value=value.replace(/[e\+\-]/gi,''))", 'min' => '0', 'value' => '0', 'step' => '.01', 'pattern' => "^\d*(\.\d{0,2})?$"]) }}
                        <div class="input-group-append" style="width: 210px !important;">
                            {{ Form::select('discount_type', $discount_type, 0, ['class' => 'form-select io-select2', 'id' => 'discountType', 'data-control' => 'select2']) }}
                        </div>
                    </div>
                </div> --}}
            </div>
            <div class="col-xxl-3 col-lg-5 col-md-6 ms-md-auto mt-4 mb-lg-10 mb-6">
                <div class="border-top">
                    <table class="table table-borderless box-shadow-none mb-0 mt-5">
                        <tbody>
                            <tr>
                                <td class="ps-0">{{ __('messages.sales.sale_order_tax') . ':' }}</td>
                                <td class="text-gray-900 text-end pe-0">
                                    @if (!getSettingValue('currency_after_amount'))
                                        <span>{{ getCurrencySymbol() }}</span>
                                    @endif <span id="saleOrderTaxPercent" class="price">
                                        0.00
                                    </span>
                                    @if (getSettingValue('currency_after_amount'))
                                        <span>{{ getCurrencySymbol() }}</span>
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <td class="ps-0">{{ __('messages.sales.sale_discount') . ':' }}</td>
                                <td class="text-gray-900 text-end pe-0">
                                    @if (!getSettingValue('currency_after_amount'))
                                        <span>{{ getCurrencySymbol() }}</span>
                                    @endif <span id="saleDiscountAmount">
                                        0.00
                                    </span>
                                    @if (getSettingValue('currency_after_amount'))
                                        <span>{{ getCurrencySymbol() }}</span>
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <td class="ps-0">{{ __('messages.sales.sale_shipping') . ':' }}</td>
                                <td class="text-gray-900 text-end pe-0">
                                    @if (!getSettingValue('currency_after_amount'))
                                        <span>{{ getCurrencySymbol() }}</span>
                                    @endif <span id="saleFinalAmount">
                                        0
                                    </span>
                                    @if (getSettingValue('currency_after_amount'))
                                        <span>{{ getCurrencySymbol() }}</span>
                                    @endif
                                </td>
                            </tr>
                            <tr>
                                <td class="ps-0">{{ __('messages.sales.sale_grand_total') . ':' }}</td>
                                <td class="text-gray-900 text-end pe-0">
                                    @if (!getSettingValue('currency_after_amount'))
                                        <span>{{ getCurrencySymbol() }}</span>
                                    @endif <span id="saleGrandTotal">
                                        0
                                    </span>
                                    @if (getSettingValue('currency_after_amount'))
                                        <span>{{ getCurrencySymbol() }}</span>
                                    @endif
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="form-group col-lg-4 col-sm-12 mb-5 ">
                {{ Form::label('order_tax',__('messages.sales.sale_order_tax').':', ['class' => 'form-label required mb-3']) }}
                <div class="input-group">
                    {{ Form::number('order_tax', null, ['id'=>'order_tax','class' => 'form-control form-control-solid amount d-flex','step'=>'any','oninput'=>"validity.valid||(value=value.replace(/[e\+\-]/gi,''))",'min'=>'0','pattern'=>"^\d*(\.\d{0,2})?$",'required','placeholder'=>__('0.00')]) }}
                    <a class="input-group-text bg-secondary border-0 text-decoration-none invoice-currency-code" id="autoCode" href="javascript:void(0)"
                       data-toggle="tooltip"
                       data-placement="right" title="Currency Code">
                        {{ getCurrencySymbol() }}
                    </a>
                </div>
            </div>
            <div class="form-group col-lg-4 col-sm-12 mb-5 ">
                {{ Form::label('discount',__('messages.sales.sale_discount').':', ['class' => 'form-label required mb-3']) }}
                <div class="input-group">
                    {{ Form::number('discount', null, ['id'=>'discount','class' => 'form-control form-control-solid discount d-flex','step'=>'any','oninput'=>"validity.valid||(value=value.replace(/[e\+\-]/gi,''))",'min'=>'0','pattern'=>"^\d*(\.\d{0,2})?$",'required','placeholder'=>__('0.00')]) }}
                    <a class="input-group-text bg-secondary border-0 text-decoration-none invoice-currency-code" id="autoCode" href="javascript:void(0)"
                       data-toggle="tooltip"
                       data-placement="right" title="Currency Code">
                        {{ getCurrencySymbol() }}
                    </a>
                </div>
            </div>
            <div class="form-group col-lg-4 col-sm-12 mb-5 ">
                {{ Form::label('shipping',__('messages.sales.sale_shipping').':', ['class' => 'form-label required mb-3']) }}
                <div class="input-group">
                    {{ Form::number('shipping', null, ['id'=>'shipping','class' => 'form-control form-control-solid amount d-flex','step'=>'any','oninput'=>"validity.valid||(value=value.replace(/[e\+\-]/gi,''))",'min'=>'0','pattern'=>"^\d*(\.\d{0,2})?$",'required','placeholder'=>__('0.00')]) }}
                    <a class="input-group-text bg-secondary border-0 text-decoration-none invoice-currency-code" id="autoCode" href="javascript:void(0)"
                       data-toggle="tooltip"
                       data-placement="right" title="Currency Code">
                        {{ getCurrencySymbol() }}
                    </a>
                </div>
            </div>
            <div class="form-group col-lg-4 col-sm-12 mb-5 ">
                {{ Form::label('status',__('messages.sales.sale_status').':', ['class' => 'form-label required mb-3']) }}
                <div class="input-group">
                    {{ Form::select('status_id', $clients, $client_id ?? null, ['class' => 'form-select io-select2', 'id' => 'client_id', 'placeholder' => __('messages.sales.sale_status'), 'required', 'data-control' => 'select2']) }}
                </div>
            </div>

        </div>
    </div>
    <div class="row">
            {{ Form::label('Notes', __('messages.sales.sale_notes') . ':', ['class' => 'form-label mb-3']) }}
            {{ Form::textarea('notes', null, ['class' => 'form-control form-control-solid', 'rows' => '4', 'placeholder' => __('messages.sales.sale_notes')]) }}
    </div>
</div>

<!-- Total Amount Field -->
{{ Form::hidden('amount', 0, ['class' => 'form-control', 'id' => 'quoteTotalAmount']) }}

<!-- Submit Field -->
<div class="float-end">
    <div class="form-group col-sm-12">
        <button type="button" name="draft" class="btn btn-primary mx-3" id="saveAsDraftQuote" data-status="0"
            value="0">{{ __('messages.common.save') }}
        </button>
        <a href="{{ route('quotes.index') }}"
            class="btn btn-secondary btn-active-light-primary">{{ __('messages.common.cancel') }}</a>
    </div>
</div>
