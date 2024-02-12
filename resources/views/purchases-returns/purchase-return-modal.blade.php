<div id="purchaseProductModal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h2></h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>

            </div>
            {{ Form::open(['id'=>'purchaseProductForm']) }}
            <div class="modal-body scroll-y">
                {{ Form::hidden('product_id',null,['id'=>'product_id']) }}
                <div class="row">
                    <div class="form-group col-sm-12 mb-3">
                        {{ Form::label('product_cost', __('messages.product.product_cost') . ':', ['class' => 'form-label required mb-3']) }}
                        <div class="input-group">
                            {{ Form::text('product_cost', null, ['class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.product_cost'), 'required', 'id' => 'product_cost_id', 'onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)"]) }}
                            <span class="input-group-text">{{ getCurrencySymbol() }}</span>
                        </div>
                    </div>
                    <p class="text-danger product_cost" style="display: none"></p>
                </div>
                <div class="row">
                    <div class="form-group col-sm-12 mb-3">
                        {{ Form::label('tax_type', __('messages.product.tax_type') . ':', ['class' => 'form-label required mb-3']) }}
                        {{ Form::select('tax_type', $tax_types, null, ['id' => 'tax_type_id', 'class' => 'form-select form-select-solid', 'required', 'data-control' => 'select2']) }}
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-12 mb-3">
                        {{ Form::label('order_tax', __('messages.product.order_tax') . ':', ['class' => 'form-label  mb-3']) }}
                        <div class="input-group">
                            {{ Form::text('tax_value', 0.00, ['class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.order_tax'), 'id' => 'tax_value_id', 'onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)"]) }}
                            <span class="input-group-text">%</span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-12 mb-3">
                        {{ Form::label('discount_type', __('messages.product.discount_type') . ':', ['class' => 'form-label required mb-3']) }}
                        {{ Form::select('discount_type', $discount_types, null, ['id' => 'discount_type_id', 'class' => 'form-select form-select-solid', 'required', 'data-control' => 'select2']) }}
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-12 mb-3">
                        {{ Form::label('discount_value', __('messages.product.discount_value') . ':', ['class' => 'form-label required mb-3']) }}
                        {{ Form::text('discount_value', 0.00, ['class' => 'form-control form-control-solid', 'placeholder' => __('messages.product.placeholder.discount_value'), 'id' => 'discount_value_id', 'required', 'onkeypress' => "return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57)"]) }}

                    </div>
                </div>

            </div>
            <div class="modal-footer pt-0">
                {{ Form::button(__('messages.common.save'), ['type' => 'button','class' => 'btn btn-primary me-2','id' => 'updatePurchaseReturnProduct','data-loading-text' => "<span class='spinner-border spinner-border-sm'></span> Processing..."]) }}
                <button type="button" class="btn btn-secondary btn-active-light-primary me-3"
                        data-bs-dismiss="modal">{{ __('messages.common.cancel') }}</button>
            </div>
            {{ Form::close() }}
        </div>
    </div>
</div>
