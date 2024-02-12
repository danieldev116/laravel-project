<script id="adjustmentsItemTemplate" type="text/x-jsrender">
<tr class="border-bottom border-bottom-dashed tax-tr">
        <td class="text-center item-number align-center">1</td>
        <td class="table__item-desc w-25">
            <h4 class="fs-6 mb-0">{{data['name']}}</h4>
        </td>
        <td class="table__qty">
            <h4 class="fs-6 mb-0">{{data['code']}}</h4>
        </td>

        <td>
            <span class="badge bg-light-warning"><span>{{data['stock_alert']}}&nbsp;k</span></span>
        </td>
        
        <td class="table__item-desc w-25">
            <input type="text" class="form-control" id="adjustment_qty_{{data['id']}}" oninput="validity.valid||(value=value.replace(/[e\+\-]/gi,''))">
        </td>
        
        <td class="table__item-desc w-25">
            <select class="form-control" id="adjustment_method_{{data['id']}}">
            <option value="1">Addition</option>
            <option value="2">Subtraction</option>
            </select>
        </td>

        <td class="text-end">
        <button type="button" data-bs-toggle="tooltip" title="Delete" class="btn btn-sm text-danger fs-3 btn-icon btn-active-color-danger delete-adjustment-item">
                <i class="fa-solid fa-trash"></i>
        </button>
        </td>
    </tr> 


</script>
