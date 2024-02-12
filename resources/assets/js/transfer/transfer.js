let discountType = null;
let momentFormat = "";

document.addEventListener("turbo:load", loadCreateEditQuote);

function loadCreateEditQuote() {
    $('input:text:not([readonly="readonly"])').first().blur();
    initializeSelect2CreateEditQuote();

    momentFormat = convertToMomentFormat(currentDateFormat);

}

function initializeSelect2CreateEditQuote() {

    $("#from_warehouse_id,#to_warehouse_id,#discountType,#status").select2();
    $(".tax").select2({
        placeholder: "Select TAX",
    });

    $("#transfer_date").flatpickr({
        defaultDate: new Date(),
        dateFormat: currentDateFormat,
        maxDate: new Date(),
        locale: getUserLanguages,
    });
    // let currentDate = moment(new Date())
    //     .add(1, "days")
    //     .format(convertToMomentFormat(currentDateFormat));

    // $("#transfer_date").flatpickr({
    //     defaultDate: moment(new Date()).format(
    //         convertToMomentFormat(currentDateFormat)
    //     ),
    //     dateFormat: currentDateFormat,
    //     locale: getUserLanguages,
    //     onReady: function () {
    //         if (typeof currentDate != "undefined") {
    //             currentDate.set("minDate", currentDate);
    //         }
    //     },
    // });

}

window.qtyUpdate = (obj) => {
    livewire.emit('qtyUpdate', 'o', $(obj).attr('data-pid'), $(obj).val());
};

window.transferShowProductModal = (pid) => {
   
    let pitems = $.parseJSON($('#transfer_items').val());
    let p = pitems[pid];
    if (typeof p !== 'undefined') {
        console.log(p)
        $('#transferProductModal').find('h2').html(p.name);
        $('#product_id').val(pid);
        $('#product_cost_id').val(p.product_cost);
        $('#tax_type_id').val(p.tax_type).select2();
        $('#tax_value_id').val(p.tax_value);
        $('#discount_type_id').val(p.discount_type).select2();
        $('#discount_value_id').val(p.discount_value);
        $('#transferProductModal').modal('show');
    }
}

listenClick('#updateTransferProduct', function (event) {
    event.preventDefault();
    let product_cost = $('#product_cost_id').val();
    $('.product_cost').hide();
    if (product_cost === '' || product_cost === null) {
        $('.product_cost').html('Product cost required').show();
        return false;
    }

    livewire.emit('productUpdate', {
        'product_id': $('#product_id').val(),
        'product_cost': product_cost,
        'tax_type': $('#tax_type_id').val(),
        'tax_value': $('#tax_value_id').val(),
        'discount_type': $('#discount_type_id').val(),
        'discount_value': $('#discount_value_id').val()
    });
    $('#transferProductModal').modal('hide');
});

listenClick("#saveTransferForm", function (event) {
    event.preventDefault();
    let frm = $(this).parents('form');
    if($('#from_warehouse_id').val()==""){
        displayErrorMessage("Select From Warehouse");
        return;
    }
    if($('#to_warehouse_id').val()==""){
        displayErrorMessage("Select To Warehouse");
        return;
    }
    if($('#from_warehouse_id').val()==$('#to_warehouse_id').val()){
        displayErrorMessage("You can not transfer stock in same warehouse");
        return;
    }
    screenLock();
    $.ajax({
        url: frm.attr('action'),
        type: "POST",
        dataType: "json",
        data: $('#'+frm.attr('id')).serialize(),
        beforeSend: function () {
            startLoader();
        },
        success: function (res) {
            displaySuccessMessage(res.result.message);
            Turbo.visit(route("transfers.index"));
        },
        error: function (result) {
            displayErrorMessage(result.responseJSON.message);
        },
        complete: function () {
            stopLoader();
            screenUnLock();
        },
    });
});

listenClick('.transfers-delete-btn', function (event) {
    let transfer_id = $(event.currentTarget).attr('data-id');
    deleteItem(route('transfers.destroy', transfer_id), 'transferTable',
        'Transfer');
});
