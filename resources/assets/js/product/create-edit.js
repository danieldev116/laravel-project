document.addEventListener('turbo:load', createEditProduct);

function createEditProduct() {
    loadSelect2Dropdown();
    $('#adminProductUnitId').trigger('change');
}


function loadSelect2Dropdown() {
    let categorySelect2 = $('#adminCategoryId');
    if (!categorySelect2.length) {
        return false;
    }

    if ($('#adminCategoryId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    if ($('#adminBrandId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    if ($('#adminBarcodeSymbologyId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    if ($('#adminProductUnitId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    if ($('#adminSaleUnitId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    if ($('#adminPurchaseUnitId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    if ($('#adminTaxTypeId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    if ($('#adminWarehouseId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    if ($('#adminSupplierId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    if ($('#adminProductStatusId').hasClass("select2-hidden-accessible")) {
        $('.select2-container').remove();
    }

    $('#adminCategoryId').select2({
        width: '100%',
    });

    $('#adminBrandId').select2({
        width: '100%',
    });

    $('#adminBarcodeSymbologyId').select2({
        width: '100%',
    });

    $('#adminProductUnitId').select2({
        width: '100%',
    });

    $('#adminSaleUnitId').select2({
        width: '100%',
    });

    $('#adminPurchaseUnitId').select2({
        width: '100%',
    });

    $('#adminTaxTypeId').select2({
        width: '100%',
    });

    $('#adminWarehouseId').select2({
        width: '100%',
    });

    $('#adminSupplierId').select2({
        width: '100%',
    });

    $('#adminProductStatusId').select2({
        width: '100%',
    });
}

listenChange('#adminProductUnitId', function () {
    let v = $('#adminProductUnitId').val();
    let sale_el = $('#adminSaleUnitId');
    let purchase_el = $('#adminPurchaseUnitId');
    sale_el.find('option').remove().end();
    purchase_el.find('option').remove().end();
    if (sale_el.hasClass("select2-hidden-accessible")) {
        sale_el.select2('destroy');
    }
    if (purchase_el.hasClass("select2-hidden-accessible")) {
        purchase_el.select2('destroy');
    }

    if (v !== '' && typeof v !== 'undefined') {
        if (!$.isEmptyObject(base_unit_children[v])) {
            sale_el.append('<option value="" ></option>');
            purchase_el.append('<option value="" ></option>');
            $.each(base_unit_children[v], function (k, v) {
                sale_el.append('<option value="' + k + '" >' + v + '</option>');
                purchase_el.append('<option value="' + k + '" >' + v + '</option>');
            });
        }
    }

    sale_el.val(sale_unit);
    purchase_el.val(purchase_unit);

    sale_el.select2({
        width: '100%',
        placeholder: "Choose Sale Unit"
    });
    purchase_el.select2({
        width: '100%',
        placeholder: "Choose Purchase Unit"
    });
});

function setSaleAndPurchaseUnits() {
    let v = $('#adminProductUnitId').val();
    let sale_el = $('#adminSaleUnitId');
    let purchase_el = $('#adminPurchaseUnitId');
    sale_el.select2('destroy');
    purchase_el.select2('destroy');
    if (v === '' || v === null) {

    }
}

listenChange('#countryId', function () {
    $.ajax({
        url: route('states-list'),
        type: 'get',
        dataType: 'json',
        data: {countryId: $(this).val()},
        success: function (data) {
            $('#stateId').empty()
            $('#stateId').select2({
                placeholder: 'Select State',
                allowClear: false,
            })
            $('#stateId').append(
                $('<option value=""></option>').text('Select State'));
            $.each(data.data, function (i, v) {
                $('#stateId').append($('<option></option>').attr('value', i).text(v));
            });

            if ($('#isEdit').val() && $('#stateId').val()) {
                $('#stateId').val($('#stateId').val()).trigger('change');
            }
        },
    });
});

listenChange('#stateId', function () {
    $.ajax({
        url: route('cities-list'),
        type: 'get',
        dataType: 'json',
        data: {
            stateId: $(this).val(),
            country: $('#countryId').val(),
        },
        success: function (data) {
            $('#cityId').empty()
            $('#cityId').select2({
                placeholder: 'Select City',
                allowClear: false,
            });
            $.each(data.data, function (i, v) {
                $('#cityId').append($('<option></option>').attr('value', i).text(v));
            });

            if ($('#isEdit').val() && $('#cityId').val()) {
                $('#cityId').val($('#cityId').val()).trigger('change');
            }
        },
    });
});

listenClick('.remove-image', function () {
    defaultAvatarImagePreview('#previewImage', 1);
});

listenSubmit('#clientForm, #editClientForm', function () {
    if ($('#error-msg').text() !== '') {
        $('#phoneNumber').focus();
        return false;
    }
});

listenKeyup('#code', function () {
    return $('#code').val(this.value.toUpperCase());
});
listenClick('#autoCode', function () {
    let code = Math.random().toString(36).toUpperCase().substr(2, 6);
    $('#code').val(code);
});

listenClick('.remove-image', function () {
    defaultImagePreview('#previewImage', 1);
});

listenChange('#productImages', function () {
    for (let i = 0; i < this.files.length; ++i) {
        let filereader = new FileReader();
        let img_preview = "<div class='previewItem custom-preview position-relative cursor-pointer' data-key='0'>";
        img_preview += '<img class="imagePreview" src="" />';
        img_preview += '<button type="button" class="remove-btn p-0"><i class="fa fa-trash"></i></button>';
        img_preview += '</div>';
        let $img = jQuery.parseHTML(img_preview);
        filereader.onload = function () {
            $($img).find('img').attr("src", this.result);
        };
        filereader.readAsDataURL(this.files[i]);
        $(".imagePreviewContainer").append($img);
    }
});
