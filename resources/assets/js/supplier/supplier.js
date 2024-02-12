
document.addEventListener('turbo:load', loadSupplier)

function loadSupplier () {
    initializeSelect2Supplier()
}

function initializeSelect2Supplier () {
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

listenClick('.supplier-delete-btn', function (event) {
    event.preventDefault();
    let id = $(event.currentTarget).attr('data-id')
    deleteItem(route('suppliers.destroy', id), 'supplier',
        Lang.get('messages.supplier.supplier'));
})

listenClick('#resetFilter', function () {
    $('#status_filter').val(5).trigger('change')
    $('#status_filter').select2({
        placeholder: 'All',
    })
})

listenClick('.convert-to-invoice', function (e) {
    e.preventDefault();
    let supplierId = $(this).data('id')
    $.ajax({
        url: route('suppliers.convert-to-invoice'),
        type: 'GET',
        data: {supplierId:supplierId},
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

