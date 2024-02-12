document.addEventListener('turbo:load', loadWarehouse)

function loadWarehouse () {
    initializeSelect2Warehouse()
}

function initializeSelect2Warehouse () {
    if (!select2NotExists('#status_filter')) {
        return false
    }
    removeSelect2Container(['#status_filter'])

    $('#status_filter').select2({
        placeholder: 'All',
    })

    if ($('#status').val() == '') {
        $('#status_filter').val(5).trigger('change')
    }
}

listenClick('.warehouse-delete-btn', function (event) {
    event.preventDefault();
    let id = $(event.currentTarget).attr('data-id')
    deleteItem(route('warehouse.destroy', id), 'warehouse',
        Lang.get('messages.warehouse.warehouse'));
})

listenClick('#resetFilter', function () {
    $('#status_filter').val(5).trigger('change')
    $('#status_filter').select2({
        placeholder: 'All',
    })
})

listenClick('.convert-to-invoice', function (e) {
    e.preventDefault();
    let warehouseId = $(this).data('id')
    $.ajax({
        url: route('warehouses.convert-to-invoice'),
        type: 'GET',
        data: {warehouseId:warehouseId},
        success: function (result) {
            if (result.success) {
                displaySuccessMessage(result.message);
                livewire.emit('refreshDatatable');
                livewire.emit('resetPageTable');
            }
        },
        error: function (result) {
            displayErrorMessage(result.responseJSON.message);
        },
    });
});
