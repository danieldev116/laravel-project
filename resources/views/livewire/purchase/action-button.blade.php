<div class="dropdown position-static" wire:key="{{ $row->id }}">
    <button wire:key="purchase{{ $row->id }}" type="button" title="{{ __('messages.common.action') }}"
            class="dropdown-toggle hide-arrow btn px-2 text-primary fs-3 pe-0"
            id="dropdownMenuButton1" data-bs-toggle="dropdown" data-bs-boundary="viewport" aria-expanded="false">
        <i class="fa-solid fa-ellipsis-vertical"></i>
    </button>
    <ul class="dropdown-menu min-w-170px" aria-labelledby="dropdownMenuButton1">
       
        <li>
            <a href="{{route('purchases.show',$row->id)}}" class="dropdown-item text-hover-primary me-1 edit-btn"
               data-bs-toggle="tooltip" title="{{ __('messages.purchases.view_purchase') }}" data-turbo="false">
               <i class="fa fa-eye"></i> <?php echo __('messages.purchases.view_purchase') ?>
            </a>
        </li>
        <li>
            <a href="javascript:void(0)" data-url="{{ route('purchases.download-pdf', ['purchase'=>$row]) }}"
               class="dropdown-item text-hover-primary me-1 edit-btn  purchase-download-pdf" data-bs-toggle="tooltip"
               title="{{__('messages.purchases.download_pdf')}}" >
                <i class="fa fa-file"></i> {{ __('messages.purchases.download_pdf')}}
            </a>
        </li>
        <li>
            <a href="{{route('purchases.edit',$row->id)}}" class="dropdown-item text-hover-primary me-1 edit-btn"
                data-bs-toggle="tooltip" title="{{ __('messages.purchases.edit_purchase') }}" data-turbo="false">
                <i class="fa fa-edit"></i> <?php echo __('messages.purchases.edit_purchase') ?>
            </a>
        </li>
       
        <li>
            <a href="javascript:void(0)"  data-id="{{$row->id}}" class="purchase-delete-btn dropdown-item me-1 text-hover-primary purchase-delete-btn"
               data-bs-toggle="tooltip" title="{{ __('messages.purchases.delete_purchase') }}">
                <i class="fa fa-trash"></i> <?php echo __('messages.purchases.delete_purchase') ?>
            </a>
        </li>
        

    </ul>
</div>

