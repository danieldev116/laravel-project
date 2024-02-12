<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use App\Repositories\BrandRepository;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BrandsController extends AppBaseController
{
    /** @var BrandRepository */
    public $brandsRepository;

    public function __construct(BrandRepository $brandsRepo)
    {
        $this->brandsRepository = $brandsRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): \Illuminate\View\View
    {
        return view('brands.index');
    }

    public function store(CreateBrandRequest $request): JsonResponse
    {
        $input = $request->all();
        $brand = $this->brandsRepository->storeBrand($input);

        return $this->sendResponse($brand, __('messages.flash.brand_saved'));
    }

    public function edit($brandsId)
    {

        $base = Brand::where('id', $brandsId)->first();

        return $this->sendResponse($base, __('messages.flash.brand_retrieved'));
    }

    public function update(UpdateBrandRequest $request, $brandsId): JsonResponse
    {

        $input = $request->all();
        $this->brandsRepository->updateBrand($input, $brandsId);

        return $this->sendSuccess(__('messages.flash.brand_updated'));
    }

    /**
     * @param  Brand  $brands
     */
    public function destroy($id): JsonResponse
    {

        $defaultBrand = Brand::whereId($id)->first();

        $defaultBrand->delete();

        return $this->sendSuccess(__('messages.flash.brand_deleted'));
    }
}
