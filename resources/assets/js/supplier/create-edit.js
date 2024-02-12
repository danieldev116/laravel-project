let discountType = null;
let momentFormat = "";

document.addEventListener("turbo:load", loadCreateEditSupplier);

function loadCreateEditSupplier() {
    $('input:text:not([readonly="readonly"])').first().blur();
    initializeSelect2CreateEditSupplier();
    loadSelect2ClientData();

    momentFormat = convertToMomentFormat(currentDateFormat);

    if (
        $("#supplierNoteData").val() == true ||
        $("#supplierTermData").val() == true
    ) {
        $("#supplierAddNote").hide();
        $("#supplierRemoveNote").show();
        $("#supplierNoteAdd").show();
        $("#supplierTermRemove").show();
    } else {
        $("#supplierRemoveNote").hide();
        $("#supplierNoteAdd").hide();
        $("#supplierTermRemove").hide();
    }
    if ($("#supplierRecurring").val() == true) {
        $(".recurring").show();
    } else {
        $(".recurring").hide();
    }
    if ($("#formData_recurring-1").prop("checked")) {
        $(".recurring").hide();
    }
    if ($("#discountType").val() != 0) {
        $("#discount").removeAttr("disabled");
    } else {
        $("#discount").attr("disabled", "disabled");
    }
    calculateAndSetSupplierAmount();
}
function loadSelect2ClientData() {
    if (!$("#client_id").length && !$("#discountType").length) {
        return;
    }

    $("#client_id,#discountType,#status,#templateId").select2();
}

function initializeSelect2CreateEditSupplier() {
    if (!select2NotExists(".product-supplier")) {
        return false;
    }
    removeSelect2Container([".product-supplier"]);

    $(".product-supplier").select2({
        tags: true,
    });

    $(".tax").select2({
        placeholder: "Select TAX",
    });
    $(".payment-qr-code").select2();

    $("#client_id").focus();
    let currentDate = moment(new Date())
        .add(1, "days")
        .format(convertToMomentFormat(currentDateFormat));
    let supplierDueDateFlatPicker = $("#supplierDueDate").flatpickr({
        defaultDate: currentDate,
        dateFormat: currentDateFormat,
        locale: getUserLanguages,
    });

    let editSupplierDueDateVal = moment($("#editSupplierDueDateAdmin").val()).format(
        convertToMomentFormat(currentDateFormat)
    );
    let editSupplierDueDateFlatPicker = $(".edit-supplier-due-date").flatpickr({
        dateFormat: currentDateFormat,
        defaultDate: editSupplierDueDateVal,
        locale: getUserLanguages,
    });

    $("#supplier_date").flatpickr({
        defaultDate: moment(new Date()).format(
            convertToMomentFormat(currentDateFormat)
        ),
        dateFormat: currentDateFormat,
        locale: getUserLanguages,
        onChange: function () {
            let minDate;
            if (
                currentDateFormat == "d.m.Y" ||
                currentDateFormat == "d/m/Y" ||
                currentDateFormat == "d-m-Y"
            ) {
                minDate = moment($("#quote_date").val(), momentFormat)
                    .add(1, "days")
                    .format(momentFormat);
            } else {
                minDate = moment($("#quote_date").val())
                    .add(1, "days")
                    .format(convertToMomentFormat(currentDateFormat));
            }

            if (typeof supplierDueDateFlatPicker != "undefined") {
                supplierDueDateFlatPicker.set("minDate", minDate);
            }
        },
        onReady: function () {
            if (typeof supplierDueDateFlatPicker != "undefined") {
                supplierDueDateFlatPicker.set("minDate", currentDate);
            }
        },
    });

    let editSupplierDate = $("#editSupplierDate").flatpickr({
        dateFormat: currentDateFormat,
        defaultDate: moment($("#editSupplierDateAdmin").val()).format(
            convertToMomentFormat(currentDateFormat)
        ),
        locale: getUserLanguages,
        onChange: function () {
            let minDate;
            if (
                currentDateFormat == "d.m.Y" ||
                currentDateFormat == "d/m/Y" ||
                currentDateFormat == "d-m-Y"
            ) {
                minDate = moment($("#editSupplierDate").val(), momentFormat)
                    .add(1, "days")
                    .format(momentFormat);
            } else {
                minDate = moment($("#editSupplierDate").val())
                    .add(1, "days")
                    .format(convertToMomentFormat(currentDateFormat));
            }
            if (typeof editsupplierDueDateFlatPicker != "undefined") {
                editsupplierDueDateFlatPicker.set("minDate", minDate);
            }
        },
        onReady: function () {
            let minDate;
            if (
                currentDateFormat == "d.m.Y" ||
                currentDateFormat == "d/m/Y" ||
                currentDateFormat == "d-m-Y"
            ) {
                minDate = moment($("#editSupplierDateAdmin").val(), momentFormat)
                    .add(1, "days")
                    .format(convertToMomentFormat(currentDateFormat));
            } else {
                minDate = moment($("#editSupplierDateAdmin").val())
                    .add(1, "days")
                    .format(convertToMomentFormat(currentDateFormat));
            }
            if (typeof editsupplierDueDateFlatPicker != "undefined") {
                editsupplierDueDateFlatPicker.set("minDate", minDate);
            }
        },
    });
}

listenKeyup("#supplierId", function () {
    return $("#supplierId").val(this.value.toUpperCase());
});

listenClick("#supplierAddNote", function () {
    $("#supplierAddNote").hide();
    $("#supplierRemoveNote").show();
    $("#supplierNoteAdd").show();
    $("#supplierTermRemove").show();
});
listenClick("#supplierRemoveNote", function () {
    $("#supplierAddNote").show();
    $("#supplierRemoveNote").hide();
    $("#supplierNoteAdd").hide();
    $("#supplierTermRemove").hide();
    $("#supplierNote").val("");
    $("#supplierTerm").val("");
    $("#supplierAddNote").show();
});

listenClick("#formData_recurring-0", function () {
    if ($("#formData_recurring-0").prop("checked")) {
        $(".recurring").show();
    } else {
        $(".recurring").hide();
    }
});
listenClick("#formData_recurring-1", function () {
    if ($("#formData_recurring-1").prop("checked")) {
        $(".recurring").hide();
    }
});

listenChange("#discountType", function () {
    discountType = $(this).val();
    $("#discount").val(0);
    if (discountType == 1 || discountType == 2) {
        $("#discount").removeAttr("disabled");
        if (discountType == 2) {
            let value = $("#discount").val();
            $("#discount").val(value.substring(0, 2));
        }
    } else {
        $("#discount").attr("disabled", "disabled");
        $("#discount").val(0);
        $("#supplierDiscountAmount").text("0");
    }
    calculateDiscount();
});

window.isNumberKey = (evt, element) => {
    let charCode = evt.which ? evt.which : event.keyCode;

    return !(
        (charCode !== 46 || $(element).val().indexOf(".") !== -1) &&
        (charCode < 48 || charCode > 57)
    );
};

listenClick("#addSupplierItem", function () {
    let data = {
        products: JSON.parse($("#products").val()),
    };

    let suppliereItemHtml = prepareTemplateRender("#supplieresItemTemplate", data);

    $(".suppliere-item-container").append(suppliereItemHtml);
    $(".productId").select2({
        placeholder: "Select Product or Enter free text",
        tags: true,
    });
    resetSuppliereItemIndex();
});

const resetSupplierItemIndex = () => {
    let index = 1;
    $(".supplier-item-container>tr").each(function () {
        $(this).find(".item-number").text(index);
        index++;
    });
    if (index - 1 == 0) {
        let data = {
            products: JSON.parse($("#products").val()),
        };
        let supplierItemHtml = prepareTemplateRender("#suppliersItemTemplate", data);
        $(".supplier-item-container").append(supplierItemHtml);
        $(".productId").select2();
    }
};

listenClick(".delete-supplier-item", function () {
    $(this).parents("tr").remove();
    resetSupplierItemIndex();
    calculateAndSetSupplierAmount();
});

listenChange(".product-supplier", function () {
    let productId = $(this).val();
    if (isEmpty(productId)) {
        productId = 0;
    }
    let element = $(this);
    $.ajax({
        url: route("supplier.get-product", productId),
        type: "get",
        dataType: "json",
        success: function (result) {
            if (result.success) {
                let price = "";
                $.each(result.data, function (id, productPrice) {
                    if (id === productId) price = productPrice;
                });
                element.parent().parent().find("td .price-supplier").val(price);
                element.parent().parent().find("td .qty-supplier").val(1);
                $(".price-supplier").trigger("keyup");
            }
        },
        error: function (result) {
            displayErrorMessage(result.responseJSON.message);
        },
    });
});

listenKeyup(".qty-supplier", function () {
    let qty = parseFloat($(this).val());
    let rate = $(this).parent().siblings().find(".price-supplier").val();
    rate = parseFloat(removeCommas(rate));
    let amount = calculateAmount(qty, rate);
    $(this)
        .parent()
        .siblings(".supplier-item-total")
        .text(addCommas(amount.toFixed(2).toString()));
    calculateAndSetsupplierAmount();
});

listenKeyup(".price-supplier", function () {
    let rate = $(this).val();
    rate = parseFloat(removeCommas(rate));
    let qty = $(this).parent().siblings().find(".qty-supplier").val();
    let amount = calculateAmount(qty, rate);
    $(this)
        .parent()
        .siblings(".supplier-item-total")
        .text(addCommas(amount.toFixed(2).toString()));
    calculateAndSetSupplierAmount();
});

const calculateAmount = (qty, rate) => {
    if (qty > 0 && rate > 0) {
        let price = qty * rate;
        return price;
    } else {
        return 0;
    }
};

const calculateAndSetSupplierAmount = () => {
    let supplierTotalAmount = 0;
    $(".supplier-item-container>tr").each(function () {
        let supplierItemTotal = $(this).find(".supplier-item-total").text();
        supplierItemTotal = removeCommas(supplierItemTotal);
        supplierItemTotal = isEmpty($.trim(supplierItemTotal))
            ? 0
            : parseFloat(supplierItemTotal);
        supplierTotalAmount += supplierItemTotal;
    });

    supplierTotalAmount = parseFloat(supplierTotalAmount);
    if (isNaN(supplierTotalAmount)) {
        supplierTotalAmount = 0;
    }
    $("#supplierTotal").text(addCommas(supplierTotalAmount.toFixed(2)));

    //set hidden input value
    $("#supplierTotalAmount").val(supplierTotalAmount);

    calculateDiscount();
};

const calculateDiscount = () => {
    let discount = $("#discount").val();
    discountType = $("#discountType").val();
    let itemAmount = [];
    let i = 0;
    $(".supplier-item-total").each(function () {
        itemAmount[i++] = $.trim(removeCommas($(this).text()));
    });
    $.sum = function (arr) {
        var r = 0;
        $.each(arr, function (i, v) {
            r += +v;
        });
        return r;
    };

    let totalAmount = $.sum(itemAmount);
    $("#supplierTotal").text(number_format(totalAmount));
    if (isEmpty(discount) || isEmpty(totalAmount)) {
        discount = 0;
    }
    let discountAmount = 0;
    let finalAmount = totalAmount - discountAmount;
    if (discountType == 1) {
        discountAmount = discount;
        finalAmount = totalAmount - discountAmount;
    } else if (discountType == 2) {
        discountAmount = (totalAmount * discount) / 100;
        finalAmount = totalAmount - discountAmount;
    }
    $("#supplierFinalAmount").text(number_format(finalAmount));
    $("#supplierTotalAmount").val(finalAmount.toFixed(2));
    $("#supplierDiscountAmount").text(number_format(discountAmount));
};

listen("keyup", "#discount", function () {
    let value = $(this).val();
    if (discountType == 2 && value > 100) {
        displayErrorMessage(
            "On Percentage you can only give maximum 100% discount"
        );
        $(this).val(value.slice(0, -1));

        return false;
    }
    calculateDiscount();
});

listenClick("#saveAsDraftSupplier", function (event) {

    event.preventDefault();
    let myForm = document.getElementById("supplierForm");
    let formData = new FormData(myForm);
    screenLock();
    $.ajax({
        url: route("suppliers.store"),
        type: "POST",
        dataType: "json",
        data: formData,
 
        processData: false,
        contentType: false,
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            displaySuccessMessage(result.message);
            Turbo.visit(route("suppliers.index"));
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

listenClick("#editSaveSupplier", function (event) {
    event.preventDefault();
    let formData = $("#edit_supplierForm").serialize()
    screenLock();
    $.ajax({
        url:  $("#supplierUpdateUrl").val(),
        type: "put",
        data:formData, 
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            Turbo.visit(route("suppliers.index"));
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

listen("input", ".qty-supplier", function () {
    let quantity = $(this).val();
    if (quantity.length == 8) {
        $(this).val(quantity.slice(0, -1));
    }
});