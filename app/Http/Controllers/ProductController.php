<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laracasts\Flash\Flash;

class ProductController extends AppBaseController
{
    /**
     * @var ProductRepository
     */
    public $productRepository;

    public function __construct(ProductRepository $productRepo)
    {
        $this->productRepository = $productRepo;
    }

    public function index(): \Illuminate\View\View
    {
        return view('products.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     */
    public function create(): \Illuminate\View\View
    {

        return view('products.create')->with($this->getFormParams());
    }

    public function store(CreateProductRequest $request): RedirectResponse
    {
        $input = $request->all();
        if ($input['barcode_symbol'] == Product::EAN8 && strlen($input['code']) != 7) {
            return $this->sendError('Please enter 7 digit code');
        }

        if ($input['barcode_symbol'] == Product::UPC && strlen($input['code']) != 11) {
            return $this->sendError(' Please enter 11 digit code');
        }

        $this->productRepository->store($input);
        Flash::success(__('messages.flash.product_created'));

        return redirect()->route('products.index');
    }

    public function edit($productId): \Illuminate\View\View
    {

        return view('products.edit')->with($this->getFormParams($productId));
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $input = $request->all();
        $this->productRepository->updateProduct($input, $product->id);
        Flash::success(__('messages.flash.product_updated'));

        return redirect()->route('products.index');
    }

    public function destroy(Product $product): JsonResponse
    {
        if ($product->tenant_id != Auth::user()->tenant_id) {
            return $this->sendError(__('Seems, you are not allowed to access this record.'));
        }
        $invoiceModels = [
            InvoiceItem::class,
        ];
        $result = canDelete($invoiceModels, 'product_id', $product->id);
        if ($result) {
            return $this->sendError(__('messages.flash.product_cant_deleted'));
        }
        $product->delete();

        return $this->sendSuccess(__('messages.flash.product_deleted'));
    }

    public function show($productId): \Illuminate\View\View
    {
        $product = Product::whereId($productId)->whereTenantId(Auth::user()->tenant_id)->first();
        $product->load('category');

        return view('products.show', compact('product'));
    }

    /**
     * Product add/edit basic required data
     * @param null $productId
     * @return array
     */
    private function getFormParams($productId = null): array
    {
        $base_units_data = $this->productRepository->getBaseUnitsData();
        $product = new Product();
        if (!empty($productId)) {
            $product = Product::whereId($productId)->whereTenantId(Auth::user()->tenant_id)->first();
            $product->load('category');
        }

        $tax_types = config('pos.tax_types');
        foreach ($tax_types as $k => $v) {
            $tax_types[$k] = __($v);
        }
        $product_statuses = config('pos.product_statuses');
        foreach ($product_statuses as $k => $v) {
            $product_statuses[$k] = __($v);
        }

        return [
            'product' => $product,
            'categories' => $this->productRepository->getData(),
            'brands' => $this->productRepository->getBrandsData(),
            'warehouses' => $this->productRepository->getWarehousesData(),
            'suppliers' => $this->productRepository->getSuppliersData(),
            'base_units' => $base_units_data['base_units'],
            'base_unit_children' => $base_units_data['base_unit_children'],
            'barcode_symbology' => config('pos.barcode_symbology'),
            'tax_types' => $tax_types,
            'product_statuses' => $product_statuses
        ];
    }
}
