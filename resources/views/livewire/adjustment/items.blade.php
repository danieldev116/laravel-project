<div>
    <div class="col-lg-12 md-12 mt-3"><label class="form-label">Order items:</label><span class="required "></span>
        <div class="table-responsive">
            <table class="table" id="adjustment-items">
                <thead>
                <tr>
                    <th  class="ps-3">{{ __('messages.adjustments.adjustment_column_product') }}</th>
                    <th  class="ps-3">{{ __('messages.adjustments.adjustment_column_code_product') }}</th>
                    <th  class="ps-3">{{ __('messages.adjustments.adjustment_column_stock') }}</th>
                    <th  class="ps-3">{{ __('messages.adjustments.adjustment_column_qty') }}</th>
                    <th  class="ps-3">{{ __('messages.adjustments.adjustment_column_type') }}</th>
                    <th  class="ps-3">{{ __('messages.adjustments.adjustment_column_action') }}</th>

                </tr>
                </thead>
                <tbody>
                @if(!empty($items))
                    @php 
                        $i=0;
                  
                    @endphp

                    @foreach($items as  $pid=>$item)
                    @php 
                            $default_qty = $item['quantity'];

                    @endphp
                        <tr>
                            <td>
                                <span>{{$item['name']}}</span>
                            </td>
                            <td>
                                <span>{{$item['code']}}</span>
                            </td>
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
                                               name="adjustment_items[{{ $i }}][quantity]">
                                        <span
                                            class="btn btn-primary btn-sm px-4 px-4 pt-2 input-group-text"
                                            onclick="livewire.emit('qtyUpdate','+', '{{$pid}}')">+</span>
                                    </div>
                                    <input type="hidden" name="adjustment_items[{{ $i }}][product_id]" value="{{ $pid }}" />
                                    <input type="hidden" name="adjustment_items[{{ $i }}][adjustment_item_id]" value="{{ $item['adjustment_item_id'] }}" />
                                    <input type="hidden" name="adjustment_items[{{ $i }}][isEdit]" value="{{ $item['isEdit'] }}" />
                                    <input type="hidden" name="adjustment_items[{{ $i }}][quantity]" value="{{ $item['quantity'] }}" />
                                    <input type="hidden" name="adjustment_items[{{ $i }}][method_type]" value="{{ $item['method_type'] }}" />
                                </div>
                            </td>
                            <td>
                                {{ Form::select('method_type', \App\Models\Adjustment::MethodTypes ?? null,  ['class' => 'form-control io-select2', 'id' => 'adjustment_method_type', 'onchange'=>'livewire.emit("methodUpdate", this.value)', 'placeholder' => __('messages.adjustments.adjustment_method'), 'required', 'data-control' => 'select2']) }}
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

    <input type="hidden" id="adjustment_items" value="{{ json_encode($items) }}">
</div>
