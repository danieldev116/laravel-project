
listenClick('.addExpenseCategory', function () {
    $('#addExpenseCategoryModal').appendTo('body').modal('show');
});

listenSubmit('#addExpenseCategoryForm', function (e) {
    e.preventDefault();
    $.ajax({
        url:route('expense_category.store'),
        type: 'POST',
        data: $(this).serialize(),
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#addExpenseCategoryModal').modal('hide');
                livewire.emit('refreshDatatable');
                livewire.emit('resetPageTable');
                displaySuccessMessage(result.message);
            }
        },
        error: function (result) {
            displayErrorMessage(result.responseJSON.message);
        },
        complete: function () {
            stopLoader();
        },
    });
});

listenHiddenBsModal('#addExpenseCategoryModal', function () {
    resetModalForm('#addExpenseCategoryForm', '#validationErrorsBox');
});

listenClick('.expense_category-edit-btn', function (event) {
    let UnitId = $(event.currentTarget).attr('data-id');
    UnitRenderData(UnitId);
});

function UnitRenderData(unitId) {
    $.ajax({
        url:route('expense_category.edit',unitId),
        type: 'GET',
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                console.log("result.data",result.data)
                $('#category_expenseId').val(result.data.id);
                $('#editExpenseCategoryModal').appendTo('body').modal('show');
            }
        },
        error: function (result) {
            displayErrorMessage(result.responseJSON.message);
        },
        complete: function () {
            stopLoader();
        },
    });
};

listenSubmit('#editExpenseCategoryForm', function (event) {
    event.preventDefault();
    const unitId = $('#category_expenseId').val();
    $.ajax({
        url: route('expense_category.update',  unitId),
        type: 'put',
        data: $(this).serialize(),
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#editExpenseCategoryModal').modal('hide');
                livewire.emit('refreshDatatable');
                livewire.emit('resetPageTable');
                displaySuccessMessage(result.message);
            }
        },
        error: function (result) {
            displayErrorMessage(result.responseJSON.message);
        },
        complete: function () {
            stopLoader();
        },
    });
});

listenClick('.expense_category-delete-btn', function (event) {
    let UnitId = $(event.currentTarget).attr('data-id');
    deleteItem(route('expense_category.destroy', UnitId), '#expenseCategoryTbl',
        "expenseCategory");
        // Lang.get('messages.units.base_units')
});
