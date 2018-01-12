import {inject} from 'aurelia-framework';
import {actionCreator} from 'aurelia-redux-connect';
import {STEP_BACK} from '../create-account.action-types';
import {IncrementStepActionCreator} from './increment-step';

@actionCreator()
@inject(IncrementStepActionCreator)
export class StepBackActionCreator {
    constructor(incrementStep) {
        this.incrementStep = incrementStep;
    }

    create() {
        return this.incrementStep.create(STEP_BACK);
    }
}
