let discountType = null;
let momentFormat = "";

document.addEventListener("turbo:load", loadCreateEditWarehouse);

function loadCreateEditWarehouse() {
    $('input:text:not([readonly="readonly"])').first().blur();
    initializeSelect2CreateEditWarehouse();
    loadSelect2ClientData();

    momentFormat = convertToMomentFormat(currentDateFormat);

    if (
        $("#warehouseNoteData").val() == true ||
        $("#warehouseTermData").val() == true
    ) {
        $("#warehouseAddNote").hide();
        $("#warehouseRemoveNote").show();
        $("#warehouseNoteAdd").show();
        $("#warehouseTermRemove").show();
    } else {
        $("#warehouseRemoveNote").hide();
        $("#warehouseNoteAdd").hide();
        $("#warehouseTermRemove").hide();
    }
    if ($("#warehouseRecurring").val() == true) {
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
    calculateAndSetWarehouseAmount();
}
function loadSelect2ClientData() {
    if (!$("#client_id").length && !$("#discountType").length) {
        return;
    }

    $("#client_id,#discountType,#status,#templateId").select2();
}

function initializeSelect2CreateEditWarehouse() {
    if (!select2NotExists(".product-warehouse")) {
        return false;
    }
    removeSelect2Container([".product-warehouse"]);

    $(".product-warehouse").select2({
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
    let warehouseDueDateFlatPicker = $("#warehouseDueDate").flatpickr({
        defaultDate: currentDate,
        dateFormat: currentDateFormat,
        locale: getUserLanguages,
    });

    let editWarehouseDueDateVal = moment($("#editWarehouseDueDateAdmin").val()).format(
        convertToMomentFormat(currentDateFormat)
    );
    let editWarehouseDueDateFlatPicker = $(".edit-warehouse-due-date").flatpickr({
        dateFormat: currentDateFormat,
        defaultDate: editWarehouseDueDateVal,
        locale: getUserLanguages,
    });

    $("#warehouse_date").flatpickr({
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

            if (typeof warehouseDueDateFlatPicker != "undefined") {
                warehouseDueDateFlatPicker.set("minDate", minDate);
            }
        },
        onReady: function () {
            if (typeof warehouseDueDateFlatPicker != "undefined") {
                warehouseDueDateFlatPicker.set("minDate", currentDate);
            }
        },
    });

}

listenKeyup("#warehouseId", function () {
    return $("#warehouseId").val(this.value.toUpperCase());
});

listenClick("#warehouseAddNote", function () {
    $("#warehouseAddNote").hide();
    $("#warehouseRemoveNote").show();
    $("#warehouseNoteAdd").show();
    $("#warehouseTermRemove").show();
});
listenClick("#warehouseRemoveNote", function () {
    $("#warehouseAddNote").show();
    $("#warehouseRemoveNote").hide();
    $("#warehouseNoteAdd").hide();
    $("#warehouseTermRemove").hide();
    $("#warehouseNote").val("");
    $("#warehouseTerm").val("");
    $("#warehouseAddNote").show();
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
        $("#warehouseDiscountAmount").text("0");
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

listenClick("#addWarehouseItem", function () {
    let data = {
        products: JSON.parse($("#products").val()),
    };

    let warehouseItemHtml = prepareTemplateRender("#warehousesItemTemplate", data);

    $(".warehouse-item-container").append(warehouseItemHtml);
    $(".productId").select2({
        placeholder: "Select Product or Enter free text",
        tags: true,
    });
    resetWarehouseItemIndex();
});

const resetWarehouseItemIndex = () => {
    let index = 1;
    $(".warehouse-item-container>tr").each(function () {
        $(this).find(".item-number").text(index);
        index++;
    });
    if (index - 1 == 0) {
        let data = {
            products: JSON.parse($("#products").val()),
        };
        let warehouseItemHtml = prepareTemplateRender("#warehousesItemTemplate", data);
        $(".warehouse-item-container").append(warehouseItemHtml);
        $(".productId").select2();
    }
};

listenClick(".delete-warehouse-item", function () {
    $(this).parents("tr").remove();
    resetWarehouseItemIndex();
    calculateAndSetWarehouseAmount();
});

listenChange(".product-warehouse", function () {
    let productId = $(this).val();
    if (isEmpty(productId)) {
        productId = 0;
    }
    let element = $(this);
    $.ajax({
        url: route("warehouses.get-product", productId),
        type: "get",
        dataType: "json",
        success: function (result) {
            if (result.success) {
                let price = "";
                $.each(result.data, function (id, productPrice) {
                    if (id === productId) price = productPrice;
                });
                element.parent().parent().find("td .price-warehouse").val(price);
                element.parent().parent().find("td .qty-warehouse").val(1);
                $(".price-warehouse").trigger("keyup");
            }
        },
        error: function (result) {
            displayErrorMessage(result.responseJSON.message);
        },
    });
});

listenKeyup(".qty-warehouse", function () {
    let qty = parseFloat($(this).val());
    let rate = $(this).parent().siblings().find(".price-warehouse").val();
    rate = parseFloat(removeCommas(rate));
    let amount = calculateAmount(qty, rate);
    $(this)
        .parent()
        .siblings(".warehouse-item-total")
        .text(addCommas(amount.toFixed(2).toString()));
    calculateAndSetWarehouseAmount();
});

listenKeyup(".price-warehouse", function () {
    let rate = $(this).val();
    rate = parseFloat(removeCommas(rate));
    let qty = $(this).parent().siblings().find(".qty-warehouse").val();
    let amount = calculateAmount(qty, rate);
    $(this)
        .parent()
        .siblings(".warehouse-item-total")
        .text(addCommas(amount.toFixed(2).toString()));
    calculateAndSetWarehouseAmount();
});

const calculateAmount = (qty, rate) => {
    if (qty > 0 && rate > 0) {
        let price = qty * rate;
        return price;
    } else {
        return 0;
    }
};

const calculateAndSetWarehouseAmount = () => {
    let warehouseTotalAmount = 0;
    $(".warehouse-item-container>tr").each(function () {
        let warehouseItemTotal = $(this).find(".warehouse-item-total").text();
        warehouseItemTotal = removeCommas(warehouseItemTotal);
        warehouseItemTotal = isEmpty($.trim(warehouseItemTotal))
            ? 0
            : parseFloat(warehouseItemTotal);
        warehouseTotalAmount += warehouseItemTotal;
    });

    warehouseTotalAmount = parseFloat(warehouseTotalAmount);
    if (isNaN(warehouseTotalAmount)) {
        warehouseTotalAmount = 0;
    }
    $("#warehouseTotal").text(addCommas(warehouseTotalAmount.toFixed(2)));

    //set hidden input value
    $("#warehouseTotalAmount").val(warehouseTotalAmount);

    calculateDiscount();
};

const calculateDiscount = () => {
    let discount = $("#discount").val();
    discountType = $("#discountType").val();
    let itemAmount = [];
    let i = 0;
    $(".warehouse-item-total").each(function () {
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
    $("#warehouseTotal").text(number_format(totalAmount));
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
    $("#warehouseFinalAmount").text(number_format(finalAmount));
    $("#warehouseTotalAmount").val(finalAmount.toFixed(2));
    $("#warehouseDiscountAmount").text(number_format(discountAmount));
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

listenClick("#saveAsDraftWarehouse", function (event) {

    event.preventDefault();
    let myForm = document.getElementById("warehouseForm");
    let formData = new FormData(myForm);
    screenLock();
    $.ajax({
        url: route("warehouse.store"),
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
            Turbo.visit(route("warehouse.index"));
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

listenClick("#editSaveWarehouse", function (event) {
    event.preventDefault();
    let formData = $("#edit_warehouseForm").serialize()
    screenLock();
    $.ajax({
        url:  $("#warehouseUpdateUrl").val(),
        type: "put",
        data:formData, 
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            Turbo.visit(route("warehouse.index"));
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

listen("input", ".qty-warehouse", function () {
    let quantity = $(this).val();
    if (quantity.length == 8) {
        $(this).val(quantity.slice(0, -1));
    }
});
