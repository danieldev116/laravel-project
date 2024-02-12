<div class="row gx-10 mb-5">
    <div class="col-xl-8">
        <div class="card">
            <div class="row">
                <div class="col-md-6 mb-3">
                    {{ Form::label('name', __('messages.product.name') . ':', ['class' => 'form-label required mb-3']) }}
                    <div class="btn btn-icon w-20px btn-sm">
                    </div>
                    <div class="input-group mb-5">
                        {{ Form::text('name', null, ['class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.name'), 'required', 'onkeypress' => 'return blockSpecialChar(event)']) }}
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('code', __('messages.product.code') . ':', ['class' => 'form-label required mb-3']) }}
                    <div class="btn btn-icon w-20px btn-sm btn-active-color-primary me-1" data-bs-toggle="tooltip"
                         title=""
                         data-placement="top" data-bs-original-title="{{ __('messages.product.generate_code') }}">
                        <i class="far fa-question-circle"></i>
                    </div>
                    <div class="input-group mb-5">
                        {{ Form::text('code', null, ['class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.code'), 'required', 'id' => 'code', 'maxlength' => 6, 'onkeypress' => 'return blockSpecialChar(event)']) }}
                        <a class="input-group-text border-0" id="autoCode" href="javascript:void(0)"
                           data-bs-toggle="tooltip"
                           data-placement="right" title="{{ __('messages.product.refresh_and_generate_code') }}">
                            <i class="fas fa-sync-alt fs-4"></i>
                        </a>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('category', __('messages.product.category') . ':', ['class' => 'form-label required mb-3']) }}
                    {{ Form::select('category_id', $categories, null, ['id' => 'adminCategoryId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.category'), 'required', 'data-control' => 'select2']) }}
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('brand', __('messages.product.brand') . ':', ['class' => 'form-label required mb-3']) }}
                    {{ Form::select('brand_id', $brands, null, ['id' => 'adminBrandId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.brand'), 'required', 'data-control' => 'select2']) }}
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('barcode-symbology', __('messages.product.barcode_symbology') . ':', ['class' => 'form-label required mb-3']) }}
                    {{ Form::select('barcode_symbol', $barcode_symbology, null, ['id' => 'adminBarcodeSymbologyId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.barcode_symbology'), 'required', 'data-control' => 'select2']) }}
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('product_cost', __('messages.product.product_cost') . ':', ['class' => 'form-label required mb-3']) }}
                    <div class="input-group mb-5">
                        {{ Form::text('product_cost', null, ['class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.product_cost'), 'required', 'id' => 'productCostId', 'onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)"]) }}
                        <span class="input-group-text">{{ getCurrencySymbol() }}</span>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('product_price', __('messages.product.product_price') . ':', ['class' => 'form-label required mb-3']) }}
                    <div class="input-group mb-5">
                        {{ Form::text('product_price', null, ['class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.product_price'), 'required', 'id' => 'productPriceId', 'onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)"]) }}
                        <span class="input-group-text">{{ getCurrencySymbol() }}</span>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('product_unit', __('messages.product.product_unit') . ':', ['class' => 'form-label required mb-3']) }}
                    <div class="input-group mb-5">
                        {{ Form::select('product_unit', $base_units, null, ['id' => 'adminProductUnitId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.product_unit'), 'required', 'data-control' => 'select2']) }}

                        <button type="button" class="position-absolute model-dtn btn btn-primary"
                                style="right: 0;height: 100%;">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus"
                                 class="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 448 512">
                                <path fill="currentColor"
                                      d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('sale_unit', __('messages.product.sale_unit') . ':', ['class' => 'form-label required mb-3']) }}
                    {{ Form::select('sale_unit', [], null, ['id' => 'adminSaleUnitId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.sale_unit'), 'required', 'data-control' => 'select2']) }}
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('purchase_unit', __('messages.product.purchase_unit') . ':', ['class' => 'form-label required mb-3']) }}
                    {{ Form::select('purchase_unit', [], null, ['id' => 'adminPurchaseUnitId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.purchase_unit'), 'required', 'data-control' => 'select2']) }}
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('stock_alert', __('messages.product.stock_alert') . ':', ['class' => 'form-label  mb-3']) }}
                    {{ Form::number('stock_alert', 0, ['id' => 'stockAlertPriceId', 'class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.stock_alert'), 'min' => '0', 'step' => '1', 'oninput' => "validity.valid||(value=value.replace(/\D+/g, '.'))"]) }}
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('order_tax', __('messages.product.order_tax') . ':', ['class' => 'form-label  mb-3']) }}
                    <div class="input-group mb-5">
                        {{ Form::text('order_tax', 0, ['class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.order_tax'), 'id' => 'orderTaxId', 'onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)"]) }}
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('tax_type', __('messages.product.tax_type') . ':', ['class' => 'form-label required mb-3']) }}
                    {{ Form::select('tax_type', $tax_types, null, ['id' => 'adminTaxTypeId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.tax_type'), 'required', 'data-control' => 'select2']) }}
                </div>
                <div class="col-md-6 mb-3">
                    {{ Form::label('quantity_limit', __('messages.product.quantity_limit') . ':', ['class' => 'form-label  mb-3']) }}
                    {{ Form::number('quantity_limit', null, ['id' => 'stockQuantityLimitId', 'class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.quantity_limit'), 'min' => '0', 'step' => '1', 'oninput' => "validity.valid||(value=value.replace(/\D+/g, '.'))"]) }}
                </div>
                <div class="col-md-12">
                    {{ Form::label('notes', __('messages.product.notes') . ':', ['class' => 'form-label mb-3']) }}
                    {{ Form::textarea('notes', null, ['class' => 'form-control form-control-solid', 'rows' => '4', 'placeholder' => __('messages.product.notes')]) }}
                </div>
                <div class="d-flex mt-5 justify-content-end">
                    {{ Form::submit(__('messages.common.save'), ['class' => 'btn btn-primary me-3']) }}
                    <a href="{{ route('products.index') }}" type="reset"
                       class="btn btn-secondary btn-active-light-primary">{{ __('messages.common.discard') }}</a>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-4">
        <div class="card"><label class="form-label">Multiple Image: </label>
            <div class="mb-3"><input accept=".png, .jpg, .jpeg" multiple="" type="file" id="productImages"
                                     name="images[]"
                                     class="upload-input-file form-control"></div>
            <div class="imagePreviewContainer pt-3 p-0 d-flex flex-wrap">
                @if(!empty($product->image_url['imageUrls']))
                    @foreach($product->image_url['imageUrls'] as $i=>$img)
                            <?php #echo "<pre>";var_dump($product->image_url); ?>
                        <div class='previewItem custom-preview position-relative cursor-pointer '
                             data-key="{{$product->image_url['id'][$i]}}">
                            <img class='imagePreview debug' src="{{$img}}"/>
                            <button type='button' class='remove-btn p-0'>
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>
        <div>
            @if(empty($product->id))
                <div class="col-md-12 mb-3"><h1 class="text-center">Add Stock : </h1></div>
                <div class="col-md-12 mb-3">
                    <div class="form-group w-100">
                        {{ Form::label('warehouse', __('messages.product.warehouse') . ':', ['class' => 'form-label required mb-3']) }}
                        {{ Form::select('purchase_warehouse_id', $warehouses, null, ['id' => 'adminWarehouseId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.warehouse'), 'required', 'data-control' => 'select2']) }}
                    </div>
                </div>
                <div class="col-md-12 mb-3">
                    {{ Form::label('supplier', __('messages.product.supplier') . ':', ['class' => 'form-label required mb-3']) }}
                    {{ Form::select('purchase_supplier_id', $suppliers, null, ['id' => 'adminSupplierId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.supplier'), 'required', 'data-control' => 'select2']) }}

                </div>
                <div class="col-md-12 mb-3">
                    {{ Form::label('add_stock', __('messages.product.add_stock') . ':', ['class' => 'form-label required  mb-3']) }}
                    {{ Form::number('purchase_quantity', null, ['id' => 'stockAddStockId', 'class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.add_stock'), 'min' => '0', 'required', 'step' => '1', 'oninput' => "validity.valid||(value=value.replace(/\D+/g, '.'))"]) }}
                </div>

                <div class="col-md-12">
                    {{ Form::label('status', __('messages.product.status') . ':', ['class' => 'form-label required mb-3']) }}
                    {{ Form::select('purchase_status', $product_statuses, null, ['id' => 'adminProductStatusId', 'class' => 'form-select form-select-solid', 'placeholder' => __('messages.product.placeholder.status'), 'required', 'data-control' => 'select2']) }}
                </div>
            @endif
        </div>
    </div>
</div>

<style>
    .previewItem {
        align-items: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: flex;
        flex-wrap: wrap;
        height: 100px;
        justify-content: center;
        margin: 5px;
        width: calc(25% - 10px);
    }

    .imagePreview {
        display: block;
        height: 80px;
        margin: auto;
        max-width: 100px;
        width: 100%;
    }

    .previewItem .remove-btn {
        background-color: #6571ff !important;
        border-radius: 50px;
        height: 25px;
        opacity: 0;
        position: absolute;
        right: -5px;
        top: -10px;
        transition: all .3s;
        width: 25px;
        color: #ffffff;
    }

    .previewItem:hover .remove-btn {
        opacity: 1;
    }
</style>

<script type="text/javascript">
    let sale_unit = "{{ $product->sale_unit ?? '' }}";
    let purchase_unit = "{{ $product->purchase_unit ?? '' }}";
    let base_unit_children = @json($base_unit_children);
</script>
