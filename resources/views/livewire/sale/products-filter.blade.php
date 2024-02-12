<div>
    <div class="col-lg-12 col-sm-12">
        {{ Form::label('Product', __('messages.sales.sale_product') . ':', ['class' => 'form-label required mb-3']) }}
        {{ Form::select('search', $products_available, null, ['class' => 'form-select io-select2', 'id' => 'sale_search', 'placeholder' => __('messages.sales.sale_search_product_by_code_name'), 'onchange' => 'livewire.emitTo("sale.items","addItem", this.value);this.value="";', 'data-control' => 'select2']) }}
        @if(!empty($err))
            <p id="product-filter-error" class="text-danger">{{$err}}</p>
        @endif
    </div>
</div>

<script type="text/javascript">
    document.addEventListener("livewire:load", function (event) {
        window.livewire.hook('element.updated', () => {
            //$("#product_search").select2();
            setTimeout(function () {
                $('#product-filter-error').fadeOut('fast');
            }, 2500);

            $('#warehouse_id').removeAttr('disabled');
            if ($('#sale-items').find('.product-qty').length > 0) {
                $('#warehouse_id').attr('disabled', true);
            }
        });
    });
</script>
