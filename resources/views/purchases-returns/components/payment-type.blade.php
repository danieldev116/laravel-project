@php 
    $class = "info";
    if($row->payment_type === 1) {
        $class = "success";
    }
@endphp

<span class="badge bg-light-{{ $class }} fs-7">{{$row->payment_type_label}}</span>
