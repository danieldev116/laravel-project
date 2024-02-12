// document.addEventListener("turbo:load", loadCreateEditAdjustment);
// var adjustment_product=[]

// function tb_product(data) {

//     $('.adjustment-item-container').append(`
//     <tr class="tax-tr">
//         <td class="text-center item-number align-center">${data['id']}</td>
//         <td class="table__item-desc w-25">
//             <h4 class="fs-6 mb-0">${data['name']}</h4>
//         </td>
//         <td class="table__qty">
//             <h4 class="fs-6 mb-0">${data['code']}</h4>
//         </td>

//         <td>
//             <span class="badge bg-light-warning"><span>${data['stock_alert']}&nbsp;k</span></span>
//         </td>
        
//         <td class="table__item-desc w-25">
//         <input class="form-control qty-adjustment form-control-solid" required="" name="quantity[]" type="number" min="0" step="1" oninput="validity.valid||(value=value.replace(/[e\+\-]/gi,''))">
//         </td>
        
//         <td class="table__item-desc w-25">
//             <select class="form-control" id="adjustment_method_${data['id']}">
//             <option value="1">Addition</option>
//             <option value="2">Subtraction</option>
//             </select>
//         </td>

//         <td class="text-end">
//             <button type="button" title="Delete" id="action_${data['id']}" 
//                 class="btn btn-icon fs-3 text-danger btn-active-color-danger delete-adjustment-item">
//                 <i class="fa-solid fa-trash"></i>
//             </button>
//         </td>
//     </tr> 
// `)
// }
// function loadCreateEditAdjustment() {
//     $('input:text:not([readonly="readonly"])').first().blur();
//     initializeSelect2CreateEditAdjustment();
// }   


// function initializeSelect2CreateEditAdjustment() {
//     $("#adjustment_warehouse_id").select2({
//         placeholder: "Select Warehouse",
//         tags: true,
//     });
//     $("#adjustment_date").flatpickr({
//         defaultDate: new Date(),
//         dateFormat: currentDateFormat,
//         maxDate: new Date(),
//         locale: getUserLanguages,
//     });

        
//     $('#id_search_by_product_code').on('input', function(){
//         if($('#adjustment_warehouse_id').val()==''){
//             $('#adjustment_warehouse_warning').css('visibility', 'visible');
//             return 
//         }
//         $('#adjustment_warehouse_warning').css('visibility', 'hidden');
//             let productId = $(this).val();
//             $.ajax({
//                 url: route("adjustments.get-product", productId),
//                 type: "get",
//                 dataType: "json",
//                 success: function (result) {
//                     if (result.data) {
//                         $('#adjustment_warehouse_id').prop('disabled', true);
//                         let data=result.data[0];
//                         console.log(data)

//                         if(adjustment_product.length==0){
//                             adjustment_product.push(data)
//                             tb_product(data)

//                             resetAdjustmentItemIndex();
//                         }
//                         else {
//                             if (adjustment_product.some(item => item.id === data['id'])) {
//                                 displayErrorMessage('Already Added');
//                             }
//                             else
//                             {
//                                 adjustment_product.push(data)
//                                 tb_product(data);

//                                 resetAdjustmentItemIndex();
//                             }
//                         }
//                     }
//                 },
//                 error: function (result) {
//                     displayErrorMessage(result.responseJSON.message);
//                 },
//             });
//     });

   
//     listenClick("#saveAsDraftadjustment", function (event) {
//         event.preventDefault();
//             let warehouse_id=$('#adjustment_warehouse_id').val()
//             let adjustment_date=$('#adjustment_date').val()
//             var data=[]
//             $('#id_adjustment_tbody tr').each(function(){
                
//                 var rowData = {};
//                 $(this).find('td').each(function(index){
//                     if(index === 0) {
//                         rowData['product_id'] = $(this).text();
//                     }  else if(index === 4) {
//                         rowData['quantity'] = Number($(this).find('input').val());
//                     } else if(index === 5) {
//                         rowData['method_type'] = $(this).find('select').val();
//                     }
//                 });
//                 data.push(rowData);
//             })

//             let formData={}
//             formData['warehouse_id']=warehouse_id
//             formData['date']=new Date(adjustment_date).toISOString()
//             formData['adjustment_items']=data
//             screenLock();
//             $.ajax({
//                 url: route("adjustments.store"),
//                 type: "POST",
//                 dataType: "json",
//                 data: formData,
//                 beforeSend: function () {
//                     startLoader();
//                 },
//                 success: function (result) {
//                     adjustment_product=[]
//                     displaySuccessMessage(result.message)
//                     Turbo.visit(route("adjustments.index"));
//                 },
//                 error: function (result) {
//                     displayErrorMessage(result.responseJSON.message);
//                 },
//                 complete: function () {
//                     stopLoader();
//                     screenUnLock();
//                 },
//             });
//     });

//     // ****************edit**************
//     //show the datepicker of edit
//     let editQuoteDueDateVal = moment($("#id_edit_adjustment_date").val()).format(
//         convertToMomentFormat(currentDateFormat)
//     );

//     $("#edit_adjustment_date").flatpickr({
//         dateFormat: currentDateFormat,
//         defaultDate: editQuoteDueDateVal,
//         locale: getUserLanguages,
//     });
//     $('#edit_warehouse_id').prop('disabled', true);
    
//     //get the table data of edit
//         let items_data=$('#edit_adjustment').val()?JSON.parse($('#edit_adjustment').val()):[]

//     //show the data to the table of edit 
//     if(items_data.length!=0) {
//         showEditExistData(items_data['adjustment_items']);
        
//         resetAdjustmentItemIndex()
//     }   
    
//     //edit_search_project
//     $('#edit_id_search_by_product_code').on('input', function(){
//             let productId = $(this).val();
//             $.ajax({
//                 url: route("adjustments.get-product", productId),
//                 type: "get",
//                 dataType: "json",
//                 success: function (result) {
//                     if (result.data) {
//                         $('#adjustment_warehouse_id').prop('disabled', true);
//                         let data=result.data[0];
//                         console.log(data)

//                         if(adjustment_product.length==0){
//                             adjustment_product.push(data)
//                             tb_product(data)

//                             resetAdjustmentItemIndex();
//                         }
//                         else {
//                             if (adjustment_product.some(item => item.id === data['id'])) {
//                                 displayErrorMessage('Already Added');
//                             }
//                             else
//                             {
//                                 adjustment_product.push(data)
//                                 tb_product(data);

//                                 resetAdjustmentItemIndex();
//                             }
//                         }
//                     }
//                 },
//                 error: function (result) {
//                     displayErrorMessage(result.responseJSON.message);
//                 },
//             });
//     });

// }
// function editTableProduct(data) {
//     $('#edit_id_adjustment_tbody').append(`
//     <tr class="tax-tr">
//         <td class="text-center item-number align-center">${data['id']}</td>
//         <td class="table__item-desc w-25">
//             <h4 class="fs-6 mb-0">${data['name']}</h4>
//         </td>
//         <td class="table__qty">
//             <h4 class="fs-6 mb-0">${data['code']}</h4>
//         </td>

//         <td>
//             <span class="badge bg-light-warning"><span>${data['stock_alert']}&nbsp;k</span></span>
//         </td>
        
//         <td class="table__item-desc w-25">
//         <input class="form-control qty-adjustment form-control-solid" required="" name="quantity[]" type="number" min="0" step="1" oninput="validity.valid||(value=value.replace(/[e\+\-]/gi,''))">
//         </td>
        
//         <td class="table__item-desc w-25">
//             <select class="form-control" id="adjustment_method_${data['id']}">
//             <option value="1">Addition</option>
//             <option value="2">Subtraction</option>
//             </select>
//         </td>

//         <td class="text-end">
//             <button type="button" title="Delete" id="action_${data['id']}" 
//                 class="btn btn-icon fs-3 text-danger btn-active-color-danger delete-adjustment-item">
//                 <i class="fa-solid fa-trash"></i>
//             </button>
//         </td>
//     </tr> 
// `)
// }
// function showEditExistData(data){

//     for(let i=0;i<data.length;i++) {
//         adjustment_product.push(data[i]['product']);
//         $('#edit_id_adjustment_tbody').append(`
//         <tr class="tax-tr">
//             <td class="text-center item-number align-center">${data[i]['id']}</td>
//             <td class="table__item-desc w-25">
//                 <h4 class="fs-6 mb-0">${data[i]['product']['name']}</h4>
//             </td>
//             <td class="table__qty">
//                 <h4 class="fs-6 mb-0">${data[i]['product']['code']}</h4>
//             </td>
    
//             <td>
//                 <span class="badge bg-light-warning"><span>${data[i]['product']['stock_alert']}&nbsp;k</span></span>
//             </td>
            
//             <td class="table__item-desc w-25">
//             <input class="form-control qty-adjustment form-control-solid" required="" value=${data[i]['quantity']} type="number" min="0" step="1" oninput="validity.valid||(value=value.replace(/[e\+\-]/gi,''))">
//             </td>
            
//             <td class="table__item-desc w-25">
//                 <select class="form-control" >
//                 <option value="1">Addition</option>
//                 <option value="2">Subtraction</option>
//                 </select>
//             </td>
    
//             <td class="text-end">
//                 <button type="button" title="Delete" 
//                     class="btn btn-icon fs-3 text-danger btn-active-color-danger delete-adjustment-item">
//                     <i class="fa-solid fa-trash"></i>
//                 </button>
//             </td>
//         </tr> 
//     `)
//     }
    
// }
// // listenKeyup("#adjustmentId", function () {
// //     return $("#adjustmentId").val(this.value.toUpperCase());
// // });


// window.isNumberKey = (evt, element) => {
//     let charCode = evt.which ? evt.which : event.keyCode;

//     return !(
//         (charCode !== 46 || $(element).val().indexOf(".") !== -1) &&
//         (charCode < 48 || charCode > 57)
//     );
// };


// const resetAdjustmentItemIndex = () => {
//     let index = 1;
//     $(".adjustment-item-container>tr").each(function () {
//         $(this).find(".item-number").text(index);
//         index++;
//     });

// };
// listenClick(".delete-adjustment-item", function () {
//     var index=$(this).parents("tr").find("td:first").text()-1
//     if (index > -1 && index < adjustment_product.length) {
//         adjustment_product.splice(index, 1); // Remove the element at the found index
//     }
//     $(this).parents("tr").remove();
//     resetAdjustmentItemIndex();
// });
// listenClick('.adjustments-delete-btn', function (event) {
//     event.preventDefault();
//     let id = $(event.currentTarget).attr('data-id')
//     deleteItem(route('adjustments.destroy', id), 'adjustment',
//         Lang.get('messages.adjustments.adjustment'));
// })

// // listenClick('.base-unit-delete-btn', function (event) {
// //     let id = $(event.currentTarget).attr('data-id');
// //     deleteItem(route('adjustments.destroy', id), '#adjustment',
// //         );
// //         // Lang.get('messages.units.base_units')
// // });

// // listenChange(".product-adjustment", function () {
// //     let productId = $(this).val();
// //     if (isEmpty(productId)) {
// //         productId = 0;
// //     }
// //     let element = $(this);
// //     $.ajax({
// //         url: route("adjustments.get-product", productId),
// //         type: "get",
// //         dataType: "json",
// //         success: function (result) {
// //             if (result.success) {
// //                 let price = "";
// //                 $.each(result.data, function (id, productPrice) {
// //                     if (id === productId) price = productPrice;
// //                 });
// //                 element.parent().parent().find("td .price-adjustment").val(price);
// //                 element.parent().parent().find("td .qty-adjustment").val(1);
// //                 $(".price-adjustment").trigger("keyup");
// //             }
// //         },
// //         error: function (result) {
// //             displayErrorMessage(result.responseJSON.message);
// //         },
// //     });
// // });

// // listenKeyup(".qty-adjustment", function () {
// //     let qty = parseFloat($(this).val());
// //     let rate = $(this).parent().siblings().find(".price-adjustment").val();
// //     rate = parseFloat(removeCommas(rate));
// //     let amount = calculateAmount(qty, rate);
// //     $(this)
// //         .parent()
// //         .siblings(".adjustment-item-total")
// //         .text(addCommas(amount.toFixed(2).toString()));
// //     calculateAndSetAdjustmentAmount();
// // });

// // listenKeyup(".price-adjustment", function () {
// //     let rate = $(this).val();
// //     rate = parseFloat(removeCommas(rate));
// //     let qty = $(this).parent().siblings().find(".qty-adjustment").val();
// //     let amount = calculateAmount(qty, rate);
// //     $(this)
// //         .parent()
// //         .siblings(".adjustment-item-total")
// //         .text(addCommas(amount.toFixed(2).toString()));
// //     calculateAndSetAdjustmentAmount();
// // });

// // const calculateAmount = (qty, rate) => {
// //     if (qty > 0 && rate > 0) {
// //         let price = qty * rate;
// //         return price;
// //     } else {
// //         return 0;
// //     }
// // };

// // const calculateAndSetAdjustmentAmount = () => {
// //     let adjustmentTotalAmount = 0;
// //     $(".adjustment-item-container>tr").each(function () {
// //         let adjustmentItemTotal = $(this).find(".adjustment-item-total").text();
// //         adjustmentItemTotal = removeCommas(adjustmentItemTotal);
// //         adjustmentItemTotal = isEmpty($.trim(adjustmentItemTotal))
// //             ? 0
// //             : parseFloat(adjustmentItemTotal);
// //         adjustmentTotalAmount += adjustmentItemTotal;
// //     });

// //     adjustmentTotalAmount = parseFloat(adjustmentTotalAmount);
// //     if (isNaN(adjustmentTotalAmount)) {
// //         adjustmentTotalAmount = 0;
// //     }
// //     $("#adjustmentTotal").text(addCommas(adjustmentTotalAmount.toFixed(2)));

// //     //set hidden input value
// //     $("#adjustmentTotalAmount").val(adjustmentTotalAmount);

// //     calculateDiscount();
// // };

// // const calculateDiscount = () => {
// //     let discount = $("#discount").val();
// //     discountType = $("#discountType").val();
// //     let itemAmount = [];
// //     let i = 0;
// //     $(".adjustment-item-total").each(function () {
// //         itemAmount[i++] = $.trim(removeCommas($(this).text()));
// //     });
// //     $.sum = function (arr) {
// //         var r = 0;
// //         $.each(arr, function (i, v) {
// //             r += +v;
// //         });
// //         return r;
// //     };

// //     let totalAmount = $.sum(itemAmount);
// //     $("#adjustmentTotal").text(number_format(totalAmount));
// //     if (isEmpty(discount) || isEmpty(totalAmount)) {
// //         discount = 0;
// //     }
// //     let discountAmount = 0;
// //     let finalAmount = totalAmount - discountAmount;
// //     if (discountType == 1) {
// //         discountAmount = discount;
// //         finalAmount = totalAmount - discountAmount;
// //     } else if (discountType == 2) {
// //         discountAmount = (totalAmount * discount) / 100;
// //         finalAmount = totalAmount - discountAmount;
// //     }
// //     $("#adjustmentFinalAmount").text(number_format(finalAmount));
// //     $("#adjustmentTotalAmount").val(finalAmount.toFixed(2));
// //     $("#adjustmentDiscountAmount").text(number_format(discountAmount));
// // };

// // listen("keyup", "#discount", function () {
// //     let value = $(this).val();
// //     if (discountType == 2 && value > 100) {
// //         displayErrorMessage(
// //             "On Percentage you can only give maximum 100% discount"
// //         );
// //         $(this).val(value.slice(0, -1));

// //         return false;
// //     }
// //     calculateDiscount();
// // });

// // listenClick("#saveAsDraftAdjustment", function (event) {
// //     event.preventDefault();

// //     let adjustmentStates = $(this).data("status");
// //     let myForm = document.getElementById("adjustmentForm");
// //     let formData = new FormData(myForm);
// //     formData.append("status", adjustmentStates);
// //     screenLock();
// //     $.ajax({
// //         url: route("adjustments.store"),
// //         type: "POST",
// //         dataType: "json",
// //         data: formData,
// //         processData: false,
// //         contentType: false,
// //         beforeSend: function () {
// //             startLoader();
// //         },
// //         success: function (result) {
// //             // displaySuccessMessage(result.message)
// //             Turbo.visit(route("adjustments.index"));
// //         },
// //         error: function (result) {
// //             displayErrorMessage(result.responseJSON.message);
// //         },
// //         complete: function () {
// //             stopLoader();
// //             screenUnLock();
// //         },
// //     });
// // });

// listenClick("#editSaveAsDraftadjustment", function (event) {
//     event.preventDefault();
//             let warehouse_id=$('#edit_adjustment_warehouse').val()
//             let adjustment_date=$('#edit_adjustment_date').val()
//             var data=[]
//             $('#edit_id_adjustment_tbody tr').each(function(){
                
//                 var rowData = {};
//                 $(this).find('td').each(function(index){
//                     if(index === 0) {
//                         rowData['product_id'] = $(this).text();
//                     }  else if(index === 4) {
//                         rowData['quantity'] = Number($(this).find('input').val());
//                     } else if(index === 5) {
//                         rowData['method_type'] = $(this).find('select').val();
//                     }
//                 });
//                 data.push(rowData);
//             })

//             let formData={}
//             formData['warehouse_id']=warehouse_id
//             formData['date']=new Date(adjustment_date).toISOString()
//             formData['adjustment_items']=data
//             screenLock();
//             $.ajax({
//                 url: $("#adjustmentUpdateUrl").val(),
//                 type: "PUT",
//                 dataType: "json",
//                 data: formData,
//                 beforeSend: function () {
//                     startLoader();
//                 },
//                 success: function (result) {
//                     displaySuccessMessage(result.message)
//                     Turbo.visit(route("adjustments.index"));
//                     adjustment_product=[]
//                 },
//                 error: function (result) {
//                     displayErrorMessage(result.responseJSON.message);
//                 },
//                 complete: function () {
//                     stopLoader();
//                     screenUnLock();
//                 },
//             });
// });

// // listen("input", ".qty-adjustment", function () {
// //     let quantity = $(this).val();
// //     if (quantity.length == 8) {
// //         $(this).val(quantity.slice(0, -1));
// //     }
// // });
