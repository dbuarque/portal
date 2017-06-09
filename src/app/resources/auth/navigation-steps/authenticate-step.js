/**
 * Created by Ishai on 4/3/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import {Redirect} from 'aurelia-router';
import {AppStore} from 'global-resources';
import {AccountSyncer} from '../../crud/local-storage/account-syncer';

@inject(AppStore, AccountSyncer)
export default class AuthenticateStep {

    constructor(appStore, accountSyncer) {
        this.appStore = appStore;
        this.accountSyncer = accountSyncer;
    }

    async run(navigationInstruction, next) {
        await this.accountSyncer.init();

        const account = this.appStore.getState().account;

        if (navigationInstruction.config.accountRequired && !(account && account.id)) {
            return next.cancel(new Redirect('login'));
        }

        return next();
    }
}
