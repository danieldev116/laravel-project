document.addEventListener('turbo:load', loadCustomer)

function loadCustomer () {
    initializeSelect2Customer()
}

function initializeSelect2Customer () {
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

listenClick('.customer-delete-btn', function (event) {
    event.preventDefault();
    let id = $(event.currentTarget).attr('data-id')
    deleteItem(route('customers.destroy', id), 'customer',
        Lang.get('messages.customer.customer'));
})

listenClick('#resetFilter', function () {
    $('#status_filter').val(5).trigger('change')
    $('#status_filter').select2({
        placeholder: 'All',
    })
})

listenClick('.convert-to-invoice', function (e) {
    e.preventDefault();
    let customerId = $(this).data('id')
    $.ajax({
        url: route('customers.convert-to-invoice'),
        type: 'GET',
        data: {customerId:customerId},
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