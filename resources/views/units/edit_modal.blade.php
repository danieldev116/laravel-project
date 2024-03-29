<div id="editUnitModal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h2>{{__('messages.units.edit_unit')}}</h2>
                <button type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                
            </div>
            {{ Form::open(['id'=>'editUnitForm']) }}
            <div class="modal-body scroll-y">
                <div class="alert alert-danger display-none hide" id="editValidationErrorsBox"></div>
                {{ Form::hidden('unitId',null,['id'=>'unitId']) }}
                <div class="row">
                    <div class="form-group col-sm-12 mb-5">
                        {{ Form::label('name',__('messages.common.name').':', ['class' => 'form-label required mb-3']) }}
                        {{ Form::text('name', null, ['id'=>'editUnitName','class' => 'form-control form-control-solid','required','placeholder' => __('messages.common.name')]) }}
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-12 mb-5">
                        {{ Form::label('short_name', __('messages.units.short_name').':', ['class' => 'form-label required mb-3']) }}
                        {{ Form::text('short_name', null, ['id'=>'editShortName','class' => 'form-control form-control-solid','required','placeholder' => __('messages.units.short_name')]) }}
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-sm-12 mb-5">
                        {{ Form::label('base_unit', __('messages.units.base_unit') . ':', ['class' => 'form-label required mb-3']) }}
                        {{ Form::select('base_unit', $base, ['id' => 'baseunit_Id', 'class' => 'form-select form-select-solid country', 'placeholder' => __('messages.units.choose_base_unit'), 'required', 'data-control' => 'select2']) }}
                    </div>
                </div>
            </div>
            <div class="modal-footer pt-0">
                {{ Form::button(__('messages.common.save'), ['type' => 'submit','class' => 'btn btn-primary me-2','id' => 'btnEditSave','data-loading-text' => "<span class='spinner-border spinner-border-sm'></span> Processing..."]) }}
                <button type="button" class="btn btn-secondary btn-active-light-primary me-3"
                        data-bs-dismiss="modal">{{ __('messages.common.cancel') }}</button>
            </div>
            {{ Form::close() }}
        </div>
    </div>
</div>
