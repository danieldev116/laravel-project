@php
    $auth =  Auth::check();
@endphp
<div>
    @if($auth && $isPublicView)
        <div class="d-flex overflow-auto h-55px">
            <ul class="nav nav-tabs mb-5 pb-1 overflow-auto flex-nowrap text-nowrap">
                <li class="nav-item position-relative me-7 mb-3" role="presentation">
                    <button class="nav-link active p-0" id="overview-tab" data-bs-toggle="tab"
                            data-bs-target="#overview"
                            type="button" role="tab" aria-controls="overview" aria-selected="true">
                        {{ __('messages.adjusment.overview') }}
                    </button>
                </li>
                <li class="nav-item position-relative me-7 mb-3" role="presentation">
                    <button class="nav-link p-0" id="note_terms-tab" data-bs-toggle="tab" data-bs-target="#note_terms"
                            type="button" role="tab" aria-controls="note_terms" aria-selected="false">
                        {{ __('messages.adjusment.note_terms') }}
                    </button>
                </li>
            </ul>
        </div>
    @endif
    <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="overview" role="tabpanel">
            <div class="card">
                <div class="d-flex flex-column">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-xxl-9">
                                <div class="row">
                                    <div class="col-lg-4 col-md-6">
                                        <div class="d-flex mb-md-10 mb-5">
                                            <div class="image image-circle image-small ">
                                                <img src="{{ getLogoUrl() }}" alt="user" class="object-contain">
                                            </div>
                                            <h3 class="ps-7">{{ __('messages.adjusment.adjusment') }}
                                                #{{ $adjusment->adjusment_id }}
                                            </h3>
                                        </div>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-6">
                                        <div class="d-flex flex-column mb-md-10 mb-5 mt-3 mt-md-0">
                                            <label for="name"
                                                   class="pb-2 fs-4 text-gray-600">{{ __('messages.adjusment.adjusment_date').':' }}</label>
                                            <span class="fs-4 text-gray-800">{{ \Carbon\Carbon::parse($adjusment->adjusment_date)->translatedFormat(currentDateFormat()) }}</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-3 col-md-3 col-6">
                                        <div class="d-flex flex-column mb-md-10 mb-5 mt-3 mt-md-0">
                                            <label for="name"
                                                   class="pb-2 fs-4 text-gray-600">{{ __('messages.adjusment.due_date').':' }}</label>
                                            <span class="fs-4 text-gray-800">{{ \Carbon\Carbon::parse($adjusment->due_date)->translatedFormat(currentDateFormat()) }}</span>
                                        </div>
                                    </div>
                                    <div class="col-md-2 col-6 mb-3 mb-sm-0">
                                        @if($isPublicView)
                                            <a target="_blank"
                                               href="{{ route('adjusments.pdf',['adjusment' => $adjusment->id]) }}"
                                               class="btn btn-sm btn-success text-white">{{ __('messages.adjusment.print_adjusment') }}</a>
                                        @else
                                            <a target="_blank"
                                               href="{{ route('public-view-adjusment.pdf',['adjusment' => $adjusment->adjusment_id]) }}"
                                               class="btn btn-sm btn-success text-white">{{ __('messages.adjusment.print_adjusment') }}</a>
                                        @endif
                                    </div>
                                    <div class="col-lg-5 col-md-6">
                                        <div class="d-flex flex-column mb-md-10 mb-5">
                                            <label for="name"
                                                   class="pb-2 fs-4 text-gray-600">{{ __('messages.adjusment.issue_for').':' }}</label>
                                            <span class="fs-4 text-gray-800 mb-3">{{ $adjusment->client->user->full_name }}</span>
                                            <p class="text-gray-700 fs-4 mb-0">
                                                @if(isset($adjusment->client->address) && !empty($adjusment->client->address))
                                                    {{ ucfirst($adjusment->client->address) }}
                                                @else
                                                    {{ "N/A" }}
                                                @endif
                                            </p>
                                        </div>
                                    </div>
                                    <div class="col-md-2 col-md-6">
                                        <div class="d-flex flex-column mb-md-10 mb-5">
                                            <label for="name"
                                                   class="pb-2 fs-4 text-gray-600">{{ __('messages.adjusment.issue_by').':' }}</label>
                                            <span class="fs-4 text-gray-800 mb-3">{{ getAppName() }}</span>
                                            <p class="text-gray-700 fs-4 mb-0">
                                                {{ getSettingValue('company_address') }}</p>
                                        </div>
                                    </div>
                                    <div class="col-12 table-responsive">
                                        <table class="table table-striped box-shadow-none mt-4">
                                            <thead>
                                            <tr>
                                                <th scope="col">{{ __('messages.product.product') }}</th>
                                                <th scope="col">{{ __('messages.adjusment.qty') }}</th>
                                                <th scope="col" class="text-end">{{ __('messages.adjusment.price') }}</th>
                                                <th scope="col" class="text-end">{{ __('messages.adjusment.amount') }}</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            @foreach($adjusment->adjusmentItems as $index => $adjusmentItem)
                                                <tr>
                                                    <td class="py-4">{{ isset($adjusmentItem->product->name)?$adjusmentItem->product->name:$adjusmentItem->product_name??'N/A' }}</td>
                                                    <td class="py-4">{{ $adjusmentItem->quantity }}</td>
                                                    <td class="py-4 text-end min-width-130px">{{  isset($adjusmentItem->price) ? getCurrencyAmount($adjusmentItem->price,true,$adjusment->tenant_id) : 'N/A' }}</td>
                                                    <td class="py-4 text-end min-width-130px">{{ isset($adjusmentItem->total) ? getCurrencyAmount($adjusmentItem->total,true,$adjusment->tenant_id) : 'N/A' }}</td>
                                                </tr>
                                            @endforeach
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col-lg-5 ms-lg-auto mt-4">
                                        <div class="border-top">
                                            <table class="table table-borderless box-shadow-none mb-0 mt-5">
                                                <tbody>
                                                <tr>
                                                    <td class="ps-0">{{ __('messages.adjusment.sub_total').(':') }}</td>
                                                    <td class="text-gray-900 text-end pe-0">{{ isset($adjusment->amount) ? getCurrencyAmount($adjusment->amount,true,$adjusment->tenant_id) : 'N/A' }}</td>
                                                </tr>
                                                <tr>
                                                    <td class="ps-0">{{ __('messages.adjusment.discount').(':') }}</td>
                                                    <td class="text-gray-900 text-end pe-0">
                                                        @if($adjusment->discount == 0 || !isset($adjusment))
                                                            <span>N/A</span>
                                                        @else
                                                            @if( $adjusment->discount_type == \App\Models\adjusment::FIXED)
                                                                {{ getCurrencyAmount($adjusment->discount,true,$adjusment->tenant_id) }}
                                                            @else
                                                                {{ getCurrencyAmount($adjusment->amount * $adjusment->discount / 100,true,$adjusment->tenant_id)}}
                                                            @endif
                                                        @endif
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="ps-0">{{ __('messages.adjusment.total').(':') }}</td>
                                                    <td class="text-gray-900 text-end pe-0">
                                                        {{ getCurrencyAmount($adjusment->final_amount,true,$adjusment->tenant_id) }}
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xxl-3 mb-5 mb-lg-0">
                                <div class="bg-gray-100 rounded-15 p-md-7 p-5 h-100 mt-xxl-0 mt-5 col-xxl-9 ms-xxl-auto w-100">
                                    <div class="mb-8">
                                        @if($adjusment->status == \App\Models\adjusment::DRAFT)
                                            <span class="badge bg-light-warning me-5">Draft</span>
                                        @elseif($adjusment->status == \App\Models\adjusment::CONVERTED)
                                            <span class="badge bg-light-success me-5">Converted</span>
                                        @endif
                                    </div>

                                    <h3 class="mb-5">{{ __('messages.adjusment.client_overview') }}</h3>
                                    <div class="row">
                                        <div class="col-xxl-12 col-lg-4 col-sm-6 d-flex flex-column mb-xxl-7 mb-lg-0 mb-4">
                                            <label for="name" class="pb-2 fs-4 text-gray-600">{{ __('messages.adjusment.client_name') }}</label>
                                            @if($auth && \Illuminate\Support\Facades\Auth::user()->hasRole('admin'))
                                                <a href="{{ route('clients.show', ['clientId' => $adjusment->client->id]) }}"
                                                   class="link-primary text-decoration-none">{{ $adjusment->client->user->full_name }}</a>

                                            @else
                                                <a href="#" class="link-primary fs-4 text-decoration-none">{{ $adjusment->client->user->full_name }}</a>
                                            @endif
                                        </div>
                                        <div class="col-xxl-12 col-lg-4 col-sm-6 d-flex flex-column mb-xxl-7 mb-lg-0 mb-4">
                                            <label for="name" class="pb-2 fs-4 text-gray-600">{{ __('messages.adjusment.client_email') }}</label>
                                            <span class="fs-4 text-gray-900">{{ $adjusment->client->user->email }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tab-pane fade show" id="note_terms" role="tabpanel">
            <div class="card">
                <div class="card-body pt-5">
                    <div class="row">
                        <div class="col-lg-12 mb-5">
                            <div class="fw-bold text-gray-600 fs-7">{{ __('messages.adjusment.note').':' }}</div>
                            <div class="fs-6">{!! $adjusment->note ?? __('messages.adjusment.note_not_found') !!}</div>
                        </div>
                        <div class="col-lg-12 mb-5">
                            <div class="fw-bold text-gray-600 fs-7">{{ __('messages.adjusment.terms').':' }}</div>
                            <div
                                class="fs-6">{!! $adjusment->term ?? __('messages.adjusment.terms_not_found') !!}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
