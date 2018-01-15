import {inject} from 'aurelia-framework';
import {actionCreator} from 'aurelia-redux-connect';
import {Router} from 'aurelia-router';
import {CreateAccountConfig} from '../create-account.config';
import {UPDATE_STEP_INDEX} from '../create-account.action-types';

@actionCreator()
@inject(Router, CreateAccountConfig)
export class UpdateStepIndexActionCreator {
    constructor(router, createAccountConfig) {
        this.router = router;
        this.createAccountConfig = createAccountConfig;
    }

    create(newIndex) {
        return (dispatch, getState) => {
            dispatch({
                type: UPDATE_STEP_INDEX,
                payload: newIndex
            });

            this.router.navigate(
                this.router.generate('createAccount') + '/' + this.createAccountConfig.routes[getState().createAccount.stepIndex + 1].name
            );
        };
    }
}
