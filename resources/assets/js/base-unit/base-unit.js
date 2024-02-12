
listenClick('.addBaseUnit', function () {
    $('#addBaseUnitModal').appendTo('body').modal('show');
});

listenSubmit('#addBaseUnitForm', function (e) {
    e.preventDefault();
    $.ajax({
        url:route('base-units.store'),
        type: 'POST',
        data: $(this).serialize(),
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#addBaseUnitModal').modal('hide');
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

listenHiddenBsModal('#addBaseUnitModal', function () {
    resetModalForm('#addBaseUnitForm', '#validationErrorsBox');
});

listenClick('.base-unit-edit-btn', function (event) {
    let baseUnitId = $(event.currentTarget).attr('data-id');
    baseUnitRenderData(baseUnitId);
});

function baseUnitRenderData(baseUnitId) {
    $.ajax({
        url:route('base-units.edit',baseUnitId),
        type: 'GET',
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#editBaseUnitName').val(result.data.name);
                $('#baseUnitId').val(result.data.id);
                $('#editBaseUnitModal').appendTo('body').modal('show');
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

listenSubmit('#editBaseUnitForm', function (event) {
    event.preventDefault();
    const baseUnitId = $('#baseUnitId').val();
    $.ajax({
        url: route('base-units.update',  baseUnitId),
        type: 'put',
        data: $(this).serialize(),
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#editBaseUnitModal').modal('hide');
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

listenClick('.base-unit-delete-btn', function (event) {
    let baseUnitId = $(event.currentTarget).attr('data-id');
    deleteItem(route('base-units.destroy', baseUnitId), '#baseUnitTbl',
        "Base Units");
        // Lang.get('messages.units.base_units')
});
