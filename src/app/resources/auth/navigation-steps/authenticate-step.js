/**
 * Created by Ishai on 4/3/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import {Redirect} from 'aurelia-router';
 import {Store} from 'au-redux';
import {AccountSyncer} from '../../crud/local-storage/account-syncer';

@inject(Store, AccountSyncer)
export default class AuthenticateStep {

    constructor(store, accountSyncer) {
        this.store = store;
        this.accountSyncer = accountSyncer;
    }

    async run(navigationInstruction, next) {
        await this.accountSyncer.init();

        const account = this.store.getState().myAccount;

        if (navigationInstruction.config.accountRequired && !(account && account.accountId)) {
            return next.cancel(new Redirect('login'));
        }

        return next();
    }
}
