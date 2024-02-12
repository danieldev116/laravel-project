@php 
    $class = "success";
    if($row->status === 2) {
        $class = "info";
    } else if($row->status === 3) {
        $class = "warning";
    }
@endphp

<span class="badge bg-light-{{ $class }} fs-7">{{$row->status}}</span>
