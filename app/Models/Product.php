<?php

namespace App\Models;

use App\Traits\Multitenantable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * App\Models\Product
 *
 * @property int $id
 * @property string $name
 * @property string $code
 * @property int $category_id
 * @property string $unit_price
 * @property string|null $description
 * @property int $brand_id
 * @property float $product_cost
 * @property float $product_price
 * @property string $product_unit
 * @property string|null $sale_unit
 * @property string|null $purchase_unit
 * @property int $warehouse_id
 * @property string|null $stock_alert
 * @property float|null $order_tax
 * @property string|null $tax_type
 * @property string|null $notes
 * @property-read \App\Models\Category|null $category
 * @property-read \App\Models\Brand|null $brand
 * @property-read string $image_url
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|Media[] $media
 * @property-read int|null $media_count
 * @property-read \App\Models\Warehouse|null $warehouse
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[]
 *     $notifications
 * @property-read int|null $notifications_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereBrandId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereOrderTax($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereProductCost($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereProductPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereProductUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product wherePurchaseUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereSaleUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereStockAlert($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereTaxType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereWarehouseId($value)
 *
 * @property-read string $barcode_image_url
 * @property int|null $barcode_symbol
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereBarcodeSymbol($value)
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Purchase[] $purchases
 * @property-read int|null $purchases_count
 * @property-read \App\Models\ManageStock|null $stock
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\ManageStock[] $stocks
 * @property-read int|null $stocks_count
 * @property string|null $quantity_limit
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereQuantityLimit($value)
 * @mixin \Eloquent
 *
 * @property string|null $tenant_id
 * @property-read \App\Models\MultiTenant|null $tenant
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereTenantId($value)
 */
class Product extends Model implements HasMedia
{
    use HasFactory, Notifiable, InteractsWithMedia, BelongsToTenant, Multitenantable;

    protected $table = 'products';

    const JSON_API_TYPE = 'products';

    public const PATH = 'product';

    public const PRODUCT_BARCODE_PATH = 'product_barcode';

    public const CODE128 = 1;

    public const CODE39 = 2;

    public const EAN8 = 3;

    public const UPC = 4;

    public const EAN13 = 5;

    protected $appends = ['image_url', 'barcode_image_url'];

    protected $fillable = [
        'name',
        'code',
        'category_id',
        'brand_id',
        'warehouse_id',
        'product_cost',
        'product_price',
        'product_unit',
        'sale_unit',
        'purchase_unit',
        'stock_alert',
        'quantity_limit',
        'order_tax',
        'tax_type',
        'notes',
        'barcode_symbol',
    ];

    public static $rules = [
        'name' => 'required',
        'code' => 'required|unique:products',
        'category_id' => 'required|exists:categories,id',
        'brand_id' => 'required|exists:brands,id',
        'product_cost' => 'required|numeric',
        'product_price' => 'required|numeric',
        'product_unit' => 'required',
        'sale_unit' => 'required',
        'purchase_unit' => 'required',
        'stock_alert' => 'nullable',
        'quantity_limit' => 'nullable',
        'order_tax' => 'nullable|numeric',
        'tax_type' => 'nullable',
        'notes' => 'nullable',
        'barcode_symbol' => 'required',
        'images.*' => 'image|mimes:jpg,jpeg,png',
        'purchase_warehouse_id' => 'required',
        'purchase_supplier_id' => 'required',
        'purchase_quantity' => 'required',
        'purchase_status' => 'required'
    ];

    public static $availableRelations = [
        'category_id' => 'category',
        'brand_id' => 'brand',
    ];

    protected $casts = [
        'product_cost' => 'float',
        'product_price' => 'float',
        'grand_total' => 'float',
        'order_tax' => 'float',
    ];

    public static $messages = [
        'code.required' => 'The product code field is required.',
        'code.size' => 'The product code must be 6 characters.',
        'code.is_unique' => 'The product code has already been taken.',
    ];

    /**
     * @return array|string
     */
    public function getImageUrlAttribute()
    {
        /** @var Media $media */
        $medias = $this->getMedia(Product::PATH);
        $images = [];
        if (!empty($medias)) {
            foreach ($medias as $key => $media) {
                $images['imageUrls'][$key] = $media->getFullUrl();
                $images['id'][$key] = $media->id;
            }

            return $images;
        }

        return '';
    }

    public function getBarcodeImageUrlAttribute(): string
    {
        /** @var Media $media */
        $media = $this->getMedia(Product::PRODUCT_BARCODE_PATH)->first();
        if (!empty($media)) {
            return $media->getFullUrl();
        }

        return '';
    }

    public function prepareLinks(): array
    {
        return [
            'self' => route('products.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'name' => $this->name,
            'code' => $this->code,
            'category_id' => $this->category_id,
            'brand_id' => $this->brand_id,
            'product_cost' => $this->product_cost,
            'product_price' => $this->product_price,
            'product_unit' => $this->product_unit,
            'sale_unit' => $this->sale_unit,
            'purchase_unit' => $this->purchase_unit,
            'stock_alert' => $this->stock_alert,
            'quantity_limit' => $this->quantity_limit,
            'order_tax' => $this->order_tax,
            'tax_type' => $this->tax_type,
            'notes' => $this->notes,
            'images' => $this->image_url,
            'category_name' => $this->Category->name,
            'brand_name' => $this->Brand->name,
            'barcode_image_url' => $this->barcode_image_url,
            'barcode_symbol' => $this->barcode_symbol,
            'created_at' => $this->created_at,
            'product_unit_name' => $this->getProductUnitName(),
            'purchase_unit_name' => $this->getPurchaseUnitName(),
            'sale_unit_name' => $this->getSaleUnitName(),
            'stock' => $this->stock,
            'warehouse' => $this->warehouse($this->id) ?? '',
            'barcode_url' => Storage::url('product_barcode/barcode-PR_' . $this->id . '.png'),
            'in_stock' => $this->inStock($this->id),
        ];

        return $fields;
    }

    /**
     * @return string[]
     */
    public function getIdFilterFields(): array
    {
        return [
            'id' => self::class,
            'category_id' => Category::class,
            'brand_id' => Brand::class,
        ];
    }

    /**
     * @return array|string
     */
    public function getProductUnitName()
    {
        $productUnit = BaseUnit::whereId($this->product_unit)->first();
        if ($productUnit) {
            return $productUnit->toArray();
        }

        return '';
    }

    /**
     * @return array|string
     */
    public function getPurchaseUnitName()
    {
        $purchaseUnit = Unit::whereId($this->purchase_unit)->first();
        if ($purchaseUnit) {
            return $purchaseUnit->toArray();
        }

        return '';
    }

    /**
     * @return array|string
     */
    public function getSaleUnitName()
    {
        $saleUnit = Unit::whereId($this->sale_unit)->first();
        if ($saleUnit) {
            return $saleUnit->toArray();
        }

        return '';
    }

    public function Category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id', 'id');
    }

    public function base_unit(): BelongsTo
    {
        return $this->belongsTo(BaseUnit::class, 'product_unit', 'id');
    }

    public function purchase_item(): BelongsTo
    {
        return $this->belongsTo(PurchaseItem::class, 'id', 'product_id');
    }

    public function stock(): HasOne
    {
        return $this->hasOne(ManageStock::class, 'product_id', 'id');
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class, 'purchase_id', 'id');
    }

    public function prepareTopSelling(): array
    {
        return [
            'name' => $this->name,
            'total_quantity' => $this->total_quantity,
            'grand_total' => $this->grand_total,
            'sale_unit' => isset($this->getSaleUnitName()['short_name']) ? $this->getSaleUnitName()['short_name'] : null,
            'image' => $this->image_url,
        ];
    }

    public function prepareProducts(): array
    {
        $imageUrls = $this->image_url;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'price' => $this->product_price,
            'sale_unit' => array_values($this->getProductUnitName())[1],
            'remaining_quantity' => $this->stock->quantity ?? 0,
            'images' => $imageUrls['imageUrls'] ?? [],
        ];
    }

    public function prepareTopSellingReport(): array
    {
        return [
            'name' => $this->name,
            'total_quantity' => $this->total_quantity,
            'price' => $this->product_price,
            'grand_total' => $this->grand_total,
            'code' => $this->code,
            'sale_unit' => isset($this->getSaleUnitName()['short_name']) ? $this->getSaleUnitName()['short_name'] : null,
        ];
    }

    public function yearlyTopSelling(): array
    {
        return [
            'name' => $this->name,
            'total_quantity' => $this->total_quantity,
            'grand_total' => $this->grand_total,
            'sale_unit' => isset($this->getSaleUnitName()['short_name']) ? $this->getSaleUnitName()['short_name'] : null,
        ];
    }

    /**
     * @return mixed
     */
    public function warehouse($id)
    {
        return Managestock::where('product_id', $id)->Join('warehouses', 'manage_stocks.warehouse_id',
            'warehouses.id')->select(DB::raw('sum(quantity) as total_quantity'),
            'warehouses.name')->groupBy('warehouse_id')->get();
    }

    /**
     * @return mixed
     */
    public function inStock($id)
    {
        $totalQuantity = Managestock::where('product_id', $id)->sum('quantity');

        return $totalQuantity;
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(ManageStock::class, 'product_id', 'id');
    }

    public function prepareProductReport()
    {
        return [
            'reference_code' => $this->code,
            'name' => $this->name,
            'total_quantity' => $this->total_quantity,
            'grand_total' => $this->grand_total,
            'product_unit' => $this->product_unit,
        ];
    }
}