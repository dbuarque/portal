import {inject} from 'aurelia-framework';
import {actionCreator} from 'aurelia-redux-connect';
import {Router} from 'aurelia-router';
import {CreateAccountConfig} from '../create-account.config';

@actionCreator()
@inject(Router, CreateAccountConfig)
export class IncrementStepActionCreator {
    constructor(router, createAccountConfig) {
        this.router = router;
        this.createAccountConfig = createAccountConfig;
    }

    create(actionType) {
        return (dispatch, getState) => {
            dispatch({
                type: actionType
            });

            this.router.navigate(
                this.router.generate('createAccount') + '/' + this.createAccountConfig.routes[getState().createAccount.stepIndex + 1].name
            );
        };
    }
}
