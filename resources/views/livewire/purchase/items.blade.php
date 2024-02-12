<div>
    <div class="col-lg-12 md-12 mt-3"><label class="form-label">Order items:</label><span class="required "></span>
        <div class="table-responsive">
            <table class="table" id="purchase-items">
                <thead>
                <tr>
                    <th  class="ps-3">{{ __('messages.purchases.purchase_product') }}</th>
                    <th  class="ps-3">{{ __('messages.purchases.purchase_column_net_unit_cost') }}</th>
                    <th  class="ps-3">{{ __('messages.purchases.purchase_column_stock') }}</th>
                    <th class="text-lg-start text-center ps-3">{{ __('messages.purchases.purchase_column_qty') }}</th>
                    <th  class="ps-3">{{ __('messages.purchases.purchase_column_discount') }}</th>
                    <th  class="ps-3">{{ __('messages.purchases.purchase_column_tax') }}</th>
                    <th  class="ps-3">{{ __('messages.purchases.purchase_column_subtotal') }}</th>
                    <th  class="ps-3">{{ __('messages.purchases.purchase_column_action') }}</th>
                </tr>
                </thead>
                <tbody>
                @if(!empty($items))
                    @php 
                        $i=0;
                    @endphp

                    @foreach($items as  $pid=>$item)
                        @php
                            $tax=$item['tax_amount'];
                            $item_discount = $item['discount_amount'];
                            $unit_price = $item['net_unit_cost'];
                            $default_qty = $item['quantity'];
                            $sub_total = $unit_price*$default_qty + $tax;
                            $total = $total + $sub_total;
                        @endphp
                        <tr>
                            <td>
                                <h4 class="product-name">{{$item['code']}}</h4>
                                <div class="d-flex align-items-center">
                                <span class="badge bg-light-success">
                                {{$item['name']}}
                                </span>
                                    <span class="badge bg-light-primary p-1 ms-1" style="cursor: pointer"
                                          onclick="showProductModal({{ $pid }})">
                                        <i class="fa fa-pencil"></i>
                                    </span>
                                </div>
                            </td>
                            <td> {{ getCurrencySymbol() }} {{ number_format($item['net_unit_cost'], 2)}}</td>
                            <td>
                                <span class="badge bg-light-warning">
                                    <span>
                                        {{$item['stock']['quantity']}}&nbsp;
                                        {{$item['purchase_unit_name']['short_name']}}
                                    </span>
                                </span>
                            </td>
                            <td>
                                <div class="custom-qty">
                                    <div class="flex-nowrap input-group">
                                        <span
                                            class="btn btn-primary btn-sm px-4 pt-2 input-group-text"
                                            onclick="livewire.emit('qtyUpdate','-', '{{$pid}}')">-</span>
                                        <input aria-label="Product Quantity" step="1" min="0" type="text"
                                               style="width:25px "
                                               class="text-center px-0 py-2 rounded-0 hide-arrow form-control product-qty"
                                               value="{{ $default_qty }}"
                                               onkeypress="return event.charCode == 46 || (event.charCode >= 48 && event.charCode <= 57);"
                                               onkeyup="qtyUpdate(this);"
                                               data-pid="{{$pid}}"
                                               name="purchase_items[{{ $i }}][quantity]">
                                        <span
                                            class="btn btn-primary btn-sm px-4 px-4 pt-2 input-group-text"
                                            onclick="livewire.emit('qtyUpdate','+', '{{$pid}}')">+</span>
                                    </div>
                                    <input type="hidden" name="purchase_items[{{ $i }}][product_id]" value="{{ $pid }}" />
                                    <input type="hidden" name="purchase_items[{{ $i }}][purchase_item_id]" value="{{ $item['purchase_item_id'] }}" />
                                    <input type="hidden" name="purchase_items[{{ $i }}][isEdit]" value="{{ $item['isEdit'] }}" />
                                    <input type="hidden" name="purchase_items[{{ $i }}][product_cost]" value="{{ $item['product_cost'] }}" />
                                    <input type="hidden" name="purchase_items[{{ $i }}][tax_type]" value="{{ $item['tax_type'] }}" />
                                    <input type="hidden" name="purchase_items[{{ $i }}][tax_value]" value="{{ $item['tax_value'] }}" />
                                    <input type="hidden" name="purchase_items[{{ $i }}][discount_type]" value="{{ $item['discount_type'] }}" />
                                    <input type="hidden" name="purchase_items[{{ $i }}][discount_value]" value="{{ $item['discount_value'] }}" />
                                    <input type="hidden" name="purchase_items[{{ $i }}][purchase_unit]" value="{{ $item['purchase_unit'] }}" />
                                </div>
                            </td>
                            <td>
                                {{ getCurrencySymbol() }} {{ number_format($item_discount,2) }}
                            </td>
                            <td>
                                {{ getCurrencySymbol() }} {{ number_format($tax,2) }}
                            </td>
                            <td>
                                {{ getCurrencySymbol() }} {{  number_format($sub_total, 2)}}
                            </td>
                            <td class="text-center">
                                <a href="javascript: void(0) " class="text-danger"
                                   onclick="livewire.emit('removeItem',{{$pid}})">
                                    <i class="fa fa-trash"></i>
                                </a>
                            </td>
                        </tr>
                        @php $i++ @endphp
                    @endforeach
                @else
                    <tr>
                        <td colspan="8" class="fs-5 px-3 py-6 text-center">No Data Available</td>
                    </tr>
                @endif
                </tbody>
            </table>
        </div>
    </div>
    <div class="col-lg-12">
        <div class="col-xxl-5 col-lg-6 col-md-6 col-12 float-end">
            @php
                $total_tax = 0;
                $total = $total - $discount; // discount given
                if(!empty($tax_rate)) {
                       $total_tax =  ($total*$tax_rate)/100;
                }
                $grand_total = $total + $total_tax; // with tax
                $grand_total = $grand_total + $shipping; // with shipping
            @endphp
            <div class="card">
                <div class="card-body pt-7 pb-2">
                    <div class="table-responsive">
                        <table class="table border">
                            <tbody>
                            <tr>
                                <td class="py-3">{{ __('messages.purchases.purchase_order_tax') }}</td>
                                <td class="py-3">{{ getCurrencySymbol() }} {{ number_format($total_tax, 2) }}
                                    ({{ number_format($tax_rate,2) }}) %
                                </td>
                            </tr>
                            <tr>
                                <td class="py-3">{{ __('messages.purchases.purchase_discount') }}</td>
                                <td class="py-3">{{ getCurrencySymbol() }} {{ number_format($discount, 2) }}</td>
                            </tr>
                            <tr>
                                <td class="py-3">{{ __('messages.purchases.purchase_shipping') }}</td>
                                <td class="py-3">{{ getCurrencySymbol() }} {{ number_format($shipping,2) }}</td>
                            </tr>
                            <tr>
                                <td class="py-3 text-primary">{{ __('messages.purchases.purchase_grand_total') }}</td>
                                <td class="py-3 text-primary">{{ getCurrencySymbol() }} {{ number_format($grand_total,2) }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <input type="hidden" id="purchase_items" value="{{ json_encode($items) }}">
</div>
