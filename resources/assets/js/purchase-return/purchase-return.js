let discountType = null;
let momentFormat = "";

document.addEventListener("turbo:load", loadCreateEditQuote);

function loadCreateEditQuote() {
    $('input:text:not([readonly="readonly"])').first().blur();
    initializeSelect2CreateEditQuote();

    momentFormat = convertToMomentFormat(currentDateFormat);

}

function initializeSelect2CreateEditQuote() {

    $("#supplier_id,#discountType,#status,#supplier_id").select2();

    $(".tax").select2({
        placeholder: "Select TAX",
    });


    let currentDate = moment(new Date())
        .add(1, "days")
        .format(convertToMomentFormat(currentDateFormat));

    $("#purchase_return_date").flatpickr({
        defaultDate: moment(new Date()).format(
            convertToMomentFormat(currentDateFormat)
        ),
        dateFormat: currentDateFormat,
        locale: getUserLanguages,
        onReady: function () {
            if (typeof quoteDueDateFlatPicker != "undefined") {
                quoteDueDateFlatPicker.set("minDate", currentDate);
            }
        },
    });

}

window.returnQtyUpdate = (obj) => {
    livewire.emitTo('purchase-return.items','qtyUpdate', 'o', $(obj).attr('data-pid'), $(obj).val());
};

window.showPurchaseReturnProductModal = (pid) => {
    let pitems = $.parseJSON($('#purchase_return_items').val());
    let p = pitems[pid];
    if (typeof p !== 'undefined') {
        $('#purchaseProductModal').find('h2').html(p.name);
        $('#product_id').val(pid);
        $('#product_cost_id').val(p.product_cost);
        $('#tax_type_id').val(p.tax_type).select2();
        $('#tax_value_id').val(p.tax_value);
        $('#discount_type_id').val(p.discount_type).select2();
        $('#discount_value_id').val(p.discount_value);
        $('#purchaseProductModal').modal('show');
    }
    console.log(p);
}

listenClick('#updatePurchaseReturnProduct', function (event) {
    event.preventDefault();
    let product_cost = $('#product_cost_id').val();
    $('.product_cost').hide();
    if (product_cost === '' || product_cost === null) {
        $('.product_cost').html('Product cost required').show();
        return false;
    }

    livewire.emitTo('purchase-return.items','productUpdate', {
        'product_id': $('#product_id').val(),
        'product_cost': product_cost,
        'tax_type': $('#tax_type_id').val(),
        'tax_value': $('#tax_value_id').val(),
        'discount_type': $('#discount_type_id').val(),
        'discount_value': $('#discount_value_id').val()
    });
    $('#purchaseProductModal').modal('hide');
});

listenClick("#savePurchaseReturnForm", function (event) {
    event.preventDefault();
    let frm = $(this).parents('form');
    $('#warehouse_id').removeAttr('disabled');
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
            Turbo.visit(route("purchases-returns.index"));
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

listenClick('.purchase-return-delete-btn', function (event) {
    let purchase_id = $(event.currentTarget).attr('data-id');
    deleteItem(route('purchases-returns.destroy', purchase_id), 'purchaseReturnTable',
        'Purchase Return');
});

listenClick('.purchase-return-download-pdf', function (event) {
    let purchase_return_download_url = $(event.currentTarget).attr('data-url');
    screenUnLock();
    $.ajax({
        url: purchase_return_download_url,
        dataType: "json",
        beforeSend: function () {
            startLoader();
        },
        success: function (res) {
            console.log(res.data.purchase_return_pdf_url);
            window.open(res.data.purchase_return_pdf_url, '_blank');
        },
        error: function (result) {
            displayErrorMessage(result.responseJSON.message);
        },
        complete: function () {
            stopLoader();
            screenUnLock();
        }
    });
});