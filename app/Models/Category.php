<?php

namespace App\Models;

use App\Traits\Multitenantable;
use Barryvdh\LaravelIdeHelper\Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * App\Models\Category
 *
 * @property int $id
 * @property string $name
 * @property string|null $tenant_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $products
 * @property-read int|null $products_count
 * @property-read MultiTenant|null $tenant
 * @property-read string $image_url
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|Media[] $media
 * @property-read int|null $media_count
 *
 * @method static Builder|Category newModelQuery()
 * @method static Builder|Category newQuery()
 * @method static Builder|Category query()
 * @method static Builder|Category whereCreatedAt($value)
 * @method static Builder|Category whereId($value)
 * @method static Builder|Category whereName($value)
 * @method static Builder|Category whereTenantId($value)
 * @method static Builder|Category whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
class Category extends Model implements HasMedia
{
    use HasFactory, BelongsToTenant, InteractsWithMedia, Multitenantable;

    protected $table = 'categories';

    protected $fillable = [
        'name', 'tenant_id'
    ];

    public const PATH = 'product_category';

    protected $appends = ['image_url'];

    protected $casts = [
        'name' => 'string',
        'tenant_id' => 'string',
    ];

    public static $rules = [
        'name' => 'required|unique:categories',
        'image' => 'image|mimes:jpg,jpeg,png',
    ];


    public function getImageUrlAttribute(): string
    {
        /** @var Media $media */
        $media = $this->getMedia(Category::PATH)->first();
        if (! empty($media)) {
            return str_replace('\\','/',$media->getFullUrl());
        }

        return url('images/productCategory_logo.jpeg');
    }

    public function prepareLinks(): array
    {
        return [
            'self' => route('categories.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'name' => $this->name,
            'image' => $this->image_url,
            'products_count' => $this->products()->count(),
        ];

        return $fields;
    }

    public function prepareCategory(): array
    {
        $fields = [
            'id' => $this->id,
            'name' => $this->name,
        ];

        return $fields;
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
    }
}
