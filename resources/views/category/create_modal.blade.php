<div id="addCategoryModal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h2>{{__('messages.category.add_category')}}</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
            </div>
            {{ Form::open(['id'=>'addCategoryForm', 'files' => 'true']) }}
            <div class="modal-body scroll-y">
                <div class="alert alert-danger display-none hide" id="validationErrorsBox"></div>
                <div class="row">
                    <div class="form-group col-sm-12 mb-5">
                        {{ Form::label('name', __('messages.common.name').':', ['class' => 'form-label required mb-3']) }}
                        {{ Form::text('name', null, ['id'=>'name','class' => 'form-control form-control-solid','required','placeholder' => __('messages.common.name')]) }}
                    </div>
                </div>
                <div class="row">
                    <div class="mb-3" io-image-input="true">
                        <label for="exampleInputImage" class="form-label">{{ __('messages.category.logo') . ':' }}</label>
                        <div class="d-block">
                            <div class="image-picker">
                                <div class="image previewImage" id="categoryImage"
                                     style="background-image: url('{{ asset('images/productCategory_logo.jpeg') }}')">
                                </div>
                                <span class="picker-edit rounded-circle text-gray-500 fs-small" data-bs-toggle="tooltip"
                                      title="{{ __('messages.category.logo') }}">
                                    <label>
                                        <i class="fa-solid fa-pen" id="categoryImageIcon"></i>
                                        <input type="file" id="category_image" name="image" class="image-upload d-none"
                                               accept="image/*" />
                                    </label>
                                </span>
                            </div>
                        </div>
                        <div class="form-text">{{ __('messages.user.allowed_file_types') }}</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer pt-0">
                {{ Form::button(__('messages.common.save'), ['type' => 'submit','class' => 'btn btn-primary me-3','id' => 'btnSave','data-loading-text' => "<span class='spinner-border spinner-border-sm'></span> Processing..."]) }}
                <button type="button" class="btn btn-secondary btn-active-light-primary me-2"
                        data-bs-dismiss="modal">{{ __('messages.common.cancel') }}</button>
            </div>
            {{ Form::close() }}
        </div>
    </div>
</div>

