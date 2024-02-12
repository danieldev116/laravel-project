<?php

namespace App\Http\Livewire\PurchaseReturn;

use App\Models\PurchaseReturn;
use Livewire\Component;
use App\Models\Product;

class Items extends Component
{
    public array $items = [];
    public $tax_rate = 0.00;
    public $discount = 0.00;
    public $shipping = 0.00;
    public $total = 0;

    protected $listeners = [
        'addItem',
        'removeItem',
        'qtyUpdate',
        'updateOrderTaxDiscountShipping',
        'productUpdate'
    ];

    public function mount($purchase_return_id) {
        
        // set purchase return items in case of edit //
        if(!empty($purchase_return_id)) {
            $purchase_return = PurchaseReturn::query()->findOrFail($purchase_return_id);
            if($purchase_return->purchaseReturnItems->count() > 0) {
                foreach($purchase_return->purchaseReturnItems as $pitem) {
                    $p = $pitem->product->prepareAttributes();
                    $p['purchase_return_item_id'] = $pitem->id;
                    $p['isEdit'] = 1;
                    $p['product_cost'] = $pitem->product_cost;
                    $p['net_unit_cost'] = $pitem->net_unit_cost;
                    $p['quantity'] = $pitem->quantity;
                    $p['discount_type'] = $pitem->discount_type;
                    $p['discount_value'] = number_format($pitem->discount_value, 2);
                    $p['discount_amount'] = number_format($pitem->discount_amount, 2);
                    $p['tax_type'] = $pitem->tax_type;
                    $p['tax_value'] = number_format($pitem->tax_value, 2);
                    $p['tax_amount'] = number_format($pitem->tax_amount, 2);
                    $this->items[$pitem->product->id] = $p;
                }
            }

            $this->tax_rate = $purchase_return->tax_rate;
            $this->discount = $purchase_return->discount;
            $this->shipping = $purchase_return->shipping;
        }
    }

    public function addItem($product_id)
    {

        if (!empty($this->items[$product_id])) {
            $this->emitTo('purchase-return.products-filter', 'errorHappen', 'Product "' . $this->items[$product_id]['name'] . '" already added');
        } else {
            $p = Product::findOrFail($product_id)->prepareAttributes();
            $p['net_unit_cost'] = $p['product_cost'];
            $p['quantity'] = 1;
            $p['purchase_return_item_id'] = "";
            $p['isEdit'] = "";
            $p['discount_type'] = 2;
            $p['discount_value'] = number_format(0, 2);
            $p['discount_amount'] = number_format(0, 2);
            $p['tax_type'] = $p['tax_type'] ?? 1;
            $p['tax_value'] = number_format($p['order_tax'], 2);
            $p['tax_amount'] = number_format(0, 2);
            $this->items[$product_id] = $this->calculateTaxAndDiscount($p);
        }
    }

    public function removeItem($product_id)
    {
        if (!empty($this->items[$product_id])) {
            unset($this->items[$product_id]);
        }
    }

    public function qtyUpdate($type, $product_id, $qty_passed = 0)
    {
        if (!empty($this->items[$product_id])) {
            $p = $this->items[$product_id];
            $current_qty = $p['quantity'];
            if ($type === '-') {
                $current_qty--;
            } else if ($type === '+') {
                $current_qty++;
            } else if ($type === 'o' && !empty($qty_passed)) {
                $current_qty = $qty_passed;
            }

            if ($current_qty < 0) {
                $current_qty = 0;
            }
            $p['quantity'] = $current_qty;

            $this->items[$product_id] = $this->calculateTaxAndDiscount($p);
        }
    }

    public function productUpdate($data)
    {
        if (!empty($this->items[$data['product_id']])) {
            $p = $this->items[$data['product_id']];
            $p['net_unit_cost'] = $p['product_cost'] = $data['product_cost'];
            $p['tax_type'] = $data['tax_type'];
            $p['tax_value'] = $data['tax_value'];
            $p['discount_type'] = $data['discount_type'];
            $p['discount_value'] = $data['discount_value'];
            $this->items[$data['product_id']] = $this->calculateTaxAndDiscount($p);
        }
    }

    private function calculateTaxAndDiscount($p) {
        
            // set discount //
            if (!empty($p['discount_type']) && !empty($p['discount_value'])) {
                $peritem_discount = 0;
                if ($p['discount_type'] == PurchaseReturn::FIXED) {
                    $peritem_discount = $p['discount_value'];

                } elseif ($p['discount_type'] == PurchaseReturn::PERCENTAGE) {
                    $peritem_discount = ($p['product_cost'] * $p['discount_value']) / 100;
                }

                $p['net_unit_cost'] = $p['product_cost'] - $peritem_discount;
                $p['discount_amount'] = $peritem_discount*$p['quantity'];
            }

            // set tax //
            if (!empty($p['tax_type']) && !empty($p['tax_value'])) {
                $peritem_tax = 0;
                if ($p['tax_type'] == PurchaseReturn::EXCLUSIVE) {
                    $peritem_tax = ($p['net_unit_cost'] * $p['tax_value']) / 100;
                } else if ($p['tax_type'] == PurchaseReturn::INCLUSIVE) {
                    $peritem_tax = ($p['net_unit_cost'] * $p['tax_value']) / (100 + $p['tax_value']);
                    $p['net_unit_cost'] = $p['net_unit_cost'] - $peritem_tax;
                }

                $p['tax_amount'] = $peritem_tax*$p['quantity'];
            }

            return $p;
    }

    public function updateOrderTaxDiscountShipping($field_name, $v)
    {
        $this->{$field_name} = (float)$v;
    }

    public function render()
    {
        return view('livewire.purchase-return.items')->with([

        ]);
    }
}
