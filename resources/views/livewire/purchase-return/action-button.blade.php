<div class="dropdown position-static" wire:key="{{ $row->id }}">
    <button wire:key="purchase{{ $row->id }}" type="button" title="{{ __('messages.common.action') }}"
            class="dropdown-toggle hide-arrow btn px-2 text-primary fs-3 pe-0"
            id="dropdownMenuButton1" data-bs-toggle="dropdown" data-bs-boundary="viewport" aria-expanded="false">
        <i class="fa-solid fa-ellipsis-vertical"></i>
    </button>
    <ul class="dropdown-menu min-w-170px" aria-labelledby="dropdownMenuButton1">
       
        <li>
            <a href="{{route('purchases-returns.show',$row->id)}}" class="dropdown-item text-hover-primary me-1 edit-btn"
               data-bs-toggle="tooltip" title="{{ __('messages.purchases.view_purchase_return') }}" data-turbo="false">
               <i class="fa fa-eye"></i> <?php echo __('messages.purchases.view_purchase_return') ?>
            </a>
        </li>
        <li>
            <a href="javascript:void(0)" data-url="{{ route('purchases-returns.download-pdf', ['purchase_return'=>$row]) }}"
               class="dropdown-item text-hover-primary me-1 edit-btn  purchase-return-download-pdf" data-bs-toggle="tooltip"
               title="{{__('messages.purchases.download_pdf')}}" >
                <i class="fa fa-file"></i> {{ __('messages.purchases.download_pdf')}}
            </a>
        </li>
        <li>
            <a href="{{route('purchases-returns.edit',$row->id)}}" class="dropdown-item text-hover-primary me-1 edit-btn"
                data-bs-toggle="tooltip" title="{{ __('messages.purchases.edit_purchase_return') }}" data-turbo="false">
                <i class="fa fa-edit"></i> <?php echo __('messages.purchases.edit_purchase_return') ?>
            </a>
        </li>
       
        <li>
            <a href="javascript:void(0)"  data-id="{{$row->id}}" class="purchase-return-delete-btn dropdown-item me-1 text-hover-primary purchase-delete-btn"
               data-bs-toggle="tooltip" title="{{ __('messages.purchases.delete_purchase_return') }}">
                <i class="fa fa-trash"></i> <?php echo __('messages.purchases.delete_purchase_return') ?>
            </a>
        </li>
        

    </ul>
</div>

