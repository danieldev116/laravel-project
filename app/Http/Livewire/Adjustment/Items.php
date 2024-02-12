<?php

namespace App\Http\Livewire\Adjustment;

use Livewire\Component;
use App\Models\Product;
use App\Models\Adjustment;
class Items extends Component
{
    public array $items = [];

    protected $listeners = [
        'addItem',
        'removeItem',
        'qtyUpdate'
    ];

    public function mount($adjustment_id) {
        
        // set adjustment items in case of edit //
        if(!empty($adjustment_id)) {
            $adjustment = Adjustment::query()->findOrFail($adjustment_id);
            if($adjustment->adjustmentItems->count() > 0) {
                foreach($adjustment->adjustmentItems as $pitem) {
                    $p = $pitem->product->prepareAttributes();
                    $p['adjustment_item_id'] = $pitem->id;
                    $p['isEdit'] = 1;
                    $p['quantity'] = $pitem->quantity;
                    $p['method_type'] = $pitem->method_type;
                    $this->items[$pitem->product->id] = $p;
                }
            }
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
            $this->items[$product_id] = $p;
        }
    }
    public function addItem($product_id)
    {

        if (!empty($this->items[$product_id])) {
            $this->emitTo('adjustment.products-filter', 'errorHappen', 'Product "' . $this->items[$product_id]['name'] . '" already added');
        } else {
            $p = Product::findOrFail($product_id)->prepareAttributes();
            $p['quantity'] = 1;
            $p['adjustment_item_id'] = "";
            $p['isEdit'] = "";
            $p['method_type'] = 1;
            $this->items[$product_id] = $p;
        }
    }

    public function removeItem($product_id)
    {
        if (!empty($this->items[$product_id])) {
            unset($this->items[$product_id]);
        }
    }


    public function render()
    {
        return view('livewire.adjustment.items');
    }
}
