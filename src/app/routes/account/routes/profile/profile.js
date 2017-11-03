/**
 * Created by Ishai on 5/2/2017.
 */

import {inject, bindable} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import {AppActionCreators} from '../../../../app-action-creators';

@inject(Store, AppActionCreators)
export class Profile {

    @connected('myAccount')
    account;

    loading = 0;

    get refreshing() {
        return this.loading > 0;
    }

    constructor(store, appActionCreators) {
        this.store = store;
        this.appActionCreators = appActionCreators;
    }

    async refresh() {
        this.loading++;

        await this.store.dispatch(this.appActionCreators.updateAccount(this.account.accountId, {
            force: true
        }));

        this.accountData.refresh();

        this.loading--;
    }
}
