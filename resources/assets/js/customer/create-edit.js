let discountType = null;
let momentFormat = "";

document.addEventListener("turbo:load", loadCreateEditCustomer);

function loadCreateEditCustomer() {
    $('input:text:not([readonly="readonly"])').first().blur();
    initializeSelect2CreateEditCustomer();
    loadSelect2ClientData();

    momentFormat = convertToMomentFormat(currentDateFormat);

    if (
        $("#customerNoteData").val() == true ||
        $("#customerTermData").val() == true
    ) {
        $("#customerAddNote").hide();
        $("#customerRemoveNote").show();
        $("#customerNoteAdd").show();
        $("#customerTermRemove").show();
    } else {
        $("#customerRemoveNote").hide();
        $("#customerNoteAdd").hide();
        $("#customerTermRemove").hide();
    }
    if ($("#customerRecurring").val() == true) {
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
    calculateAndSetCustomerAmount();
}
function loadSelect2ClientData() {
    if (!$("#client_id").length && !$("#discountType").length) {
        return;
    }

    $("#client_id,#discountType,#status,#templateId").select2();
}

function initializeSelect2CreateEditCustomer() {
    if (!select2NotExists(".product-customer")) {
        return false;
    }
    removeSelect2Container([".product-customer"]);

    $(".product-customer").select2({
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
    let customerDueDateFlatPicker = $("#customerDueDate").flatpickr({
        defaultDate: currentDate,
        dateFormat: currentDateFormat,
        locale: getUserLanguages,
    });

    let editCustomerDueDateVal = moment($("#editCustomerDueDateAdmin").val()).format(
        convertToMomentFormat(currentDateFormat)
    );
    let editCustomerDueDateFlatPicker = $(".edit-customer-due-date").flatpickr({
        dateFormat: currentDateFormat,
        defaultDate: editCustomerDueDateVal,
        locale: getUserLanguages,
    });

    $("#customer_date").flatpickr({
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

            if (typeof customerDueDateFlatPicker != "undefined") {
                customerDueDateFlatPicker.set("minDate", minDate);
            }
        },
        onReady: function () {
            if (typeof customerDueDateFlatPicker != "undefined") {
                customerDueDateFlatPicker.set("minDate", currentDate);
            }
        },
    });

    let editCustomerDate = $("#editCustomerDate").flatpickr({
        dateFormat: currentDateFormat,
        defaultDate: moment($("#editCustomerDateAdmin").val()).format(
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
                minDate = moment($("#editCustomerDate").val(), momentFormat)
                    .add(1, "days")
                    .format(momentFormat);
            } else {
                minDate = moment($("#editCustomerDate").val())
                    .add(1, "days")
                    .format(convertToMomentFormat(currentDateFormat));
            }
            if (typeof editcustomerDueDateFlatPicker != "undefined") {
                editcustomerDueDateFlatPicker.set("minDate", minDate);
            }
        },
        onReady: function () {
            let minDate;
            if (
                currentDateFormat == "d.m.Y" ||
                currentDateFormat == "d/m/Y" ||
                currentDateFormat == "d-m-Y"
            ) {
                minDate = moment($("#editCustomerDateAdmin").val(), momentFormat)
                    .add(1, "days")
                    .format(convertToMomentFormat(currentDateFormat));
            } else {
                minDate = moment($("#editCustomerDateAdmin").val())
                    .add(1, "days")
                    .format(convertToMomentFormat(currentDateFormat));
            }
            if (typeof editcustomerDueDateFlatPicker != "undefined") {
                editcustomerDueDateFlatPicker.set("minDate", minDate);
            }
        },
    });
}

listenKeyup("#customerId", function () {
    return $("#customerId").val(this.value.toUpperCase());
});

listenClick("#customerAddNote", function () {
    $("#customerAddNote").hide();
    $("#customerRemoveNote").show();
    $("#customerNoteAdd").show();
    $("#customerTermRemove").show();
});
listenClick("#customerRemoveNote", function () {
    $("#customerAddNote").show();
    $("#customerRemoveNote").hide();
    $("#customerNoteAdd").hide();
    $("#customerTermRemove").hide();
    $("#customerNote").val("");
    $("#customerTerm").val("");
    $("#customerAddNote").show();
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
        $("#customerDiscountAmount").text("0");
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

listenClick("#addCustomerItem", function () {
    let data = {
        products: JSON.parse($("#products").val()),
    };

    let customerItemHtml = prepareTemplateRender("#customerItemTemplate", data);

    $(".customere-item-container").append(customerItemHtml);
    $(".productId").select2({
        placeholder: "Select Product or Enter free text",
        tags: true,
    });
    resetCustomerItemIndex();
});

const resetCustomerItemIndex = () => {
    let index = 1;
    $(".customer-item-container>tr").each(function () {
        $(this).find(".item-number").text(index);
        index++;
    });
    if (index - 1 == 0) {
        let data = {
            products: JSON.parse($("#products").val()),
        };
        let customerItemHtml = prepareTemplateRender("#customerItemTemplate", data);
        $(".customer-item-container").append(customerItemHtml);
        $(".productId").select2();
    }
};

listenClick(".delete-customer-item", function () {
    $(this).parents("tr").remove();
    resetCustomerItemIndex();
    calculateAndSetCustomerAmount();
});

listenChange(".product-customer", function () {
    let productId = $(this).val();
    if (isEmpty(productId)) {
        productId = 0;
    }
    let element = $(this);
    $.ajax({
        url: route("customer.get-product", productId),
        type: "get",
        dataType: "json",
        success: function (result) {
            if (result.success) {
                let price = "";
                $.each(result.data, function (id, productPrice) {
                    if (id === productId) price = productPrice;
                });
                element.parent().parent().find("td .price-customer").val(price);
                element.parent().parent().find("td .qty-customer").val(1);
                $(".price-customer").trigger("keyup");
            }
        },
        error: function (result) {
            displayErrorMessage(result.responseJSON.message);
        },
    });
});

listenKeyup(".qty-customer", function () {
    let qty = parseFloat($(this).val());
    let rate = $(this).parent().siblings().find(".price-customer").val();
    rate = parseFloat(removeCommas(rate));
    let amount = calculateAmount(qty, rate);
    $(this)
        .parent()
        .siblings(".customer-item-total")
        .text(addCommas(amount.toFixed(2).toString()));
    calculateAndSetcustomerAmount();
});

listenKeyup(".price-customer", function () {
    let rate = $(this).val();
    rate = parseFloat(removeCommas(rate));
    let qty = $(this).parent().siblings().find(".qty-customer").val();
    let amount = calculateAmount(qty, rate);
    $(this)
        .parent()
        .siblings(".customer-item-total")
        .text(addCommas(amount.toFixed(2).toString()));
    calculateAndSetCustomerAmount();
});

const calculateAmount = (qty, rate) => {
    if (qty > 0 && rate > 0) {
        let price = qty * rate;
        return price;
    } else {
        return 0;
    }
};

const calculateAndSetCustomerAmount = () => {
    let customerTotalAmount = 0;
    $(".customer-item-container>tr").each(function () {
        let customerItemTotal = $(this).find(".customer-item-total").text();
        customerItemTotal = removeCommas(customerItemTotal);
        customerItemTotal = isEmpty($.trim(customerItemTotal))
            ? 0
            : parseFloat(customerItemTotal);
        customerTotalAmount += customerItemTotal;
    });

    customerTotalAmount = parseFloat(customerTotalAmount);
    if (isNaN(customerTotalAmount)) {
        customerTotalAmount = 0;
    }
    $("#customerTotal").text(addCommas(customerTotalAmount.toFixed(2)));

    //set hidden input value
    $("#customerTotalAmount").val(customerTotalAmount);

    calculateDiscount();
};

const calculateDiscount = () => {
    let discount = $("#discount").val();
    discountType = $("#discountType").val();
    let itemAmount = [];
    let i = 0;
    $(".customer-item-total").each(function () {
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
    $("#customerTotal").text(number_format(totalAmount));
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
    $("#customerFinalAmount").text(number_format(finalAmount));
    $("#customerTotalAmount").val(finalAmount.toFixed(2));
    $("#customerDiscountAmount").text(number_format(discountAmount));
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

listenClick("#saveAsDraftCustomer", function (event) {
    event.preventDefault();
    let myForm = document.getElementById("customerForm");
    let formData = new FormData(myForm);
    screenLock();
    $.ajax({
        url: route("customers.store"),
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
            Turbo.visit(route("customers.index"));
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

listenClick("#editSavecustomer", function (event) {
    event.preventDefault();
    let formData = $("#edit_customerForm").serialize()
    screenLock();
    $.ajax({
        url:  $("#customerUpdateUrl").val(),
        type: "put",
        data:formData, 
        beforeSend: function () {
            startLoader();
        },
        success: function (result) {
            Turbo.visit(route("customers.index"));
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

listen("input", ".qty-customer", function () {
    let quantity = $(this).val();
    if (quantity.length == 8) {
        $(this).val(quantity.slice(0, -1));
    }
});
