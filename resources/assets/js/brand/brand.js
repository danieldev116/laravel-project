
listenClick('.addBrand', function () {
    $('#addBrandModal').find('#brandImage').css('background-image', 'url("images/brand_logo.png")');
    $('#addBrandModal').appendTo('body').modal('show');
});

listenSubmit('#addBrandForm', function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);
    $.ajax({
        url:route('brand.store'),
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#addBrandModal').modal('hide');
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

listenHiddenBsModal('#addBrandModal', function () {
    resetModalForm('#addBrandForm', '#validationErrorsBox');
});

listenClick('.brand-edit-btn', function (event) {
    let brandId = $(event.currentTarget).attr('data-id');
    brandRenderData(brandId);
});

function brandRenderData(brandId) {
    $.ajax({
        url:route('brand.edit',brandId),
        type: 'GET',
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#editBrandName').val(result.data.name);
                $('#brandId').val(result.data.id);
                if(result.data.image_url !=='') {
                    $('#editBrandModal').find('#brandImage').css('background-image', 'url(' + result.data.image_url + ')');
                }
                $('#editBrandModal').appendTo('body').modal('show');
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

listenSubmit('#editBrandForm', function (event) {
    event.preventDefault();
    const brandId = $('#brandId').val();
    let formData = new FormData($(this)[0]);
    $.ajax({
        url: route('brand.update',  brandId),
        method: 'post',
        //data : $(this).serialize(),
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            if (result.success) {
                $('#editBrandModal').modal('hide');
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

listenClick('.brand-delete-btn', function (event) {
    let brandId = $(event.currentTarget).attr('data-id');
    deleteItem(route('brand.destroy', brandId), '#brandTbl',
        "Brands");
        // Lang.get('messages.units.base_units')
});
