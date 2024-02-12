let discountType = null;
let momentFormat = "";

document.addEventListener("turbo:load", loadCreateEditQuote);

function loadCreateEditQuote() {
    $('input:text:not([readonly="readonly"])').first().blur();
    initializeSelect2CreateEditQuote();

    momentFormat = convertToMomentFormat(currentDateFormat);

}

function initializeSelect2CreateEditQuote() {

    $("#warehouse_id").select2();

    $(".tax").select2({
        placeholder: "Select TAX",
    });


    let currentDate = moment(new Date())
        .add(1, "days")
        .format(convertToMomentFormat(currentDateFormat));

    $("#adjustment_date").flatpickr({
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

window.qtyUpdate = (obj) => {
    livewire.emit('qtyUpdate', 'o', $(obj).attr('data-pid'), $(obj).val());
};


listenClick("#saveAdjustmentForm", function (event) {
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
            Turbo.visit(route("adjustments.index"));
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

listenClick('.adjustment-delete-btn', function (event) {
    let adjustment_id = $(event.currentTarget).attr('data-id');
    deleteItem(route('adjustments.destroy', adjustment_id), 'adjustmentTable',
        'adjustment');
});

