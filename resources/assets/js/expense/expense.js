let discountType = null;
let momentFormat = "";

document.addEventListener("turbo:load", loadCreateEditexpense);

function loadCreateEditexpense() {
    $('input:text:not([readonly="readonly"])').first().blur();
    initializeSelect2CreateEditexpense();
    loadSelect2ClientData();

    momentFormat = convertToMomentFormat(currentDateFormat);

}
function loadSelect2ClientData() {

    $("#expense_warehouse_id,#expense_category_id").select2();
}

function initializeSelect2CreateEditexpense() {

    let currentDate = moment(new Date())
    .add(1, "days")
    .format(convertToMomentFormat(currentDateFormat));

    $("#expense_date").flatpickr({
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

listenKeyup("#expenseId", function () {
    return $("#expenseId").val(this.value.toUpperCase());
});


listenClick('.expense-delete-btn', function (event) {
    event.preventDefault();
    let id = $(event.currentTarget).attr('data-id')
    deleteItem(route('expenses.destroy', id), 'expense',
        Lang.get('expense'));
})


window.isNumberKey = (evt, element) => {
    let charCode = evt.which ? evt.which : event.keyCode;

    return !(
        (charCode !== 46 || $(element).val().indexOf(".") !== -1) &&
        (charCode < 48 || charCode > 57)
    );
};




listenSubmit("#saveAsDraftExpense", function (event) {
    event.preventDefault();
    let myForm = document.getElementById("expenseForm");
    let formData = new FormData(myForm);
    screenLock();
    $.ajax({
        url: route("expenses.store"),
        type: "POST",
        dataType: "json",
        data: formData,
 
        processData: false,
        contentType: false,
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            displaySuccessMessage("successed created");
            Turbo.visit(route("expenses.index"));
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

listenClick("#editSaveExpense", function (event) {
    event.preventDefault();
    let formData = $("#edit_expenseForm").serialize()
    screenLock();
    $.ajax({
        url:  $("#expenseUpdateUrl").val(),
        type: "put",
        data:formData, 
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            Turbo.visit(route("expenses.index"));
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

