<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateBaseUnitRequest;
use App\Http\Requests\UpdateBaseUnitRequest;
use App\Models\BaseUnit;
use App\Models\Product;
use App\Repositories\BaseUnitRepository;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BaseUnitController extends AppBaseController
{
    /** @var BaseUnitRepository */
    public $baseUnitRepository;

    public function __construct(BaseUnitRepository $baseunitRepo)
    {
        $this->baseUnitRepository = $baseunitRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): \Illuminate\View\View
    {
        return view('base_units.index');
    }

    public function store(CreateBaseUnitRequest $request): JsonResponse
    {
        $input = $request->all();
        $baseunit = $this->baseUnitRepository->store($input);

        return $this->sendResponse($baseunit, __('messages.flash.category_saved'));
    }

    public function edit($baseunitId)
    {

        $base = BaseUnit::where('id', $baseunitId)->first();

        return $this->sendResponse($base, __('messages.flash.category_retrieved'));
    }

    public function update(UpdateBaseUnitRequest $request, $baseunitId): JsonResponse
    {

        $input = $request->all();
        $this->baseUnitRepository->updateBaseUnit($input, $baseunitId);

        return $this->sendSuccess(__('messages.flash.category_updated'));
    }

    /**
     * @param  BaseUnit  $baseunit
     */
    public function destroy($id): JsonResponse
    {

        $defaultBaseUnit = BaseUnit::whereId($id)->first();
        // $defaultBaseUnit = BaseUnit::whereId($id)->where('is_default', true)->exists();

        // if ($defaultBaseUnit) {
        //     return $this->sendError('Default Base unit can\'t be deleted.');
        // }

            
        $defaultBaseUnit->delete();

        return $this->sendSuccess(__('messages.flash.category_deleted'));
    }
}
