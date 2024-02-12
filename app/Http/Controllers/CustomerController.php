<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\Product;
use App\Repositories\CustomerRepository;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerController extends AppBaseController
{
    /** @var CustomerRepository */
    public $customerRepository;

    public function __construct(CustomerRepository $customerRepo)
    {
        $this->customerRepository = $customerRepo;
    }

    /**
     * @throws Exception
     */
    public function index(Request $request): \Illuminate\View\View
    {
        return view('customers.index');
    }
    public function create(): View|Factory|Application
    {

        return view('customers.create');
    }
    public function store(CreateCustomerRequest $request): JsonResponse
    {
        $input = $request->all();
        $customer = $this->customerRepository->store($input);

        return $this->sendResponse($customer, __('messages.flash.customer_saved'));
    }

  
    public function edit( $customerId): JsonResponse
    {
        $customer = Customer::where('id', $customerId)->first();

        return $this->sendResponse($customer, __('messages.flash.category_retrieved'));
    }

    public function update(UpdateCustomerRequest $request, $customerId): JsonResponse
    {
        $input = $request->all();
        $this->customerRepository->updatecustomer($input, $customerId);

        return $this->sendSuccess(__('messages.flash.customer_updated'));
    }

    /**
     * @param  Customer  $customer
     */
    public function destroy($id): JsonResponse
    {
        $customer = Customer::whereId($id)->whereTenantId(Auth::user()->tenant_id)->first();
        if (! $customer) {
            return $this->sendError(__('Seems, you are not allowed to access this record.'));
        }
        $productModels = [
            Product::class,
        ];
        $result = canDelete($productModels, 'customer_id', $customer->id);
        if ($result) {
            return $this->sendError(__('messages.flash.customer_cant_deleted'));
        }
        $customer->delete();

        return $this->sendSuccess(__('messages.flash.customer_deleted'));
    }
}
