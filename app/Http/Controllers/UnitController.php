<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUnitRequest;
use App\Http\Requests\UpdateUnitRequest;
use App\Models\Unit;
use App\Models\BaseUnit;
use App\Repositories\UnitRepository;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UnitController extends AppBaseController
{
    /** @var UnitRepository */
    public $unitRepository;

    public function __construct(UnitRepository $unitRepo)
    {
        $this->unitRepository = $unitRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): \Illuminate\View\View
    {
        $base = BaseUnit::toBase()->pluck('name', 'id')->toArray();
        return view('units.index', compact('base'));
        
    }

    public function store(CreateUnitRequest $request): JsonResponse
    {
        $input = $request->all();
        $unit = $this->unitRepository->store($input);

        return $this->sendResponse($unit, __('messages.flash.category_saved'));
    }

    public function edit($unitId)
    {

        $unit = Unit::where('id', $unitId)->first();

        return $this->sendResponse($unit, __('messages.flash.category_retrieved'));
    }

    public function update(UpdateUnitRequest $request, $unitId): JsonResponse
    {

        $input = $request->all();
        $this->unitRepository->updateUnit($input, $unitId);

        return $this->sendSuccess(__('messages.flash.category_updated'));
    }

    /**
     * @param  Unit  $baseunit
     */
    public function destroy($id): JsonResponse
    {

        $defaultUnit = Unit::whereId($id)->first();
        // $defaultBaseUnit = BaseUnit::whereId($id)->where('is_default', true)->exists();

        // if ($defaultBaseUnit) {
        //     return $this->sendError('Default Base unit can\'t be deleted.');
        // }

            
        $defaultUnit->delete();

        return $this->sendSuccess(__('messages.flash.category_deleted'));
    }
}
