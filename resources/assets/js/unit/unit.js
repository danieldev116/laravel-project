
listenClick('.addUnits', function () {
    $('#addUnitModal').appendTo('body').modal('show');
});

listenSubmit('#addUnitForm', function (e) {
    e.preventDefault();
    $.ajax({
        url:route('unit.store'),
        type: 'POST',
        data: $(this).serialize(),
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#addUnitModal').modal('hide');
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

listenHiddenBsModal('#addUnitModal', function () {
    resetModalForm('#addUnitForm', '#validationErrorsBox');
});

listenClick('.unit-edit-btn', function (event) {
    let UnitId = $(event.currentTarget).attr('data-id');
    UnitRenderData(UnitId);
});

function UnitRenderData(unitId) {
    $.ajax({
        url:route('unit.edit',unitId),
        type: 'GET',
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                console.log("result.data",result.data)
                $('#editUnitName').val(result.data.name);
                $('#editShortName').val(result.data.short_name);
                $('#unitId').val(result.data.id);
                $('#editUnitModal').appendTo('body').modal('show');
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

listenSubmit('#editUnitForm', function (event) {
    event.preventDefault();
    const unitId = $('#unitId').val();
    $.ajax({
        url: route('unit.update',  unitId),
        type: 'put',
        data: $(this).serialize(),
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#editUnitModal').modal('hide');
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

listenClick('.unit-delete-btn', function (event) {
    let UnitId = $(event.currentTarget).attr('data-id');
    deleteItem(route('unit.destroy', UnitId), '#unitTbl',
        "Units");
        // Lang.get('messages.units.base_units')
});
