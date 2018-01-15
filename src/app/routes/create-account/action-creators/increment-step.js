import {inject} from 'aurelia-framework';
import {actionCreator} from 'aurelia-redux-connect';
import {UpdateStepIndexActionCreator} from './update-step-index';

@actionCreator()
@inject(UpdateStepIndexActionCreator)
export class IncrementStepActionCreator {
    constructor(updateStepIndex) {
        this.updateStepIndex = updateStepIndex;
    }

    create(change) {
        return (dispatch, getState) => {
            dispatch(
                this.updateStepIndex.create(
                    getState().createAccount.stepIndex + change
                )
            );
        };
    }
}
