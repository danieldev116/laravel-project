<?php

namespace App\Http\Livewire\Adjustment;

use Livewire\Component;
use App\Models\Product;

class ProductsFilter extends Component
{    
    public array $products_available = [];
    protected $listeners = [
        'loadWarehouseProduct',
        'errorHappen'
    ];

    public $err = '';

    public function errorHappen($error)
    {
        $this->err = $error;
    }

    public function loadWarehouseProduct($warehouse_id)
    {
        $this->products_available = [];
        if (!empty($warehouse_id)) {
            $this->warehouse_id = $warehouse_id;

            $this->products_available = Product::query()->where('warehouse_id', $warehouse_id)->pluck('name', 'id')->toArray();
        }
    }
    public function render()
    {
        return view('livewire.adjustment.products-filter');
    }
}
