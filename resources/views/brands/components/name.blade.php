<div class="d-flex align-items-center">
    <div class="me-2">
            @if(!empty($row->image_url))
                <img src="{{$row->image_url}}" alt="" class="image image-circle image-mini" width="50px" height="50px">
        @endif
    </div>
    <div class="d-flex flex-column">
        {{$row->name}}
    </div>
</div>
