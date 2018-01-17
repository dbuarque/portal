import {inject} from 'aurelia-dependency-injection';
import {RedirectToRoute} from 'aurelia-router';
import {Store} from 'aurelia-redux-connect';

@inject(Store)
export class HasAccountStep {
    constructor(store) {
        this.store = store;
    }

    run(navigationInstruction, next) {
        const {accountRequired, anonymousRequired} = navigationInstruction.config;
        const account = this.store.getState().myAccount;

        if (accountRequired && !account) {
            return next.cancel(
                new RedirectToRoute('login', {
                    redirect: navigationInstruction.fragment
                })
            );
        }
        else if (anonymousRequired && account) {
            return next.cancel(
                new RedirectToRoute('account')
            );
        }

        return next();
    }
}
