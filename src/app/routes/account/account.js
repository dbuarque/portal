/**
 * Created by istrauss on 4/22/2016.
 */

import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {AppStore} from 'global-resources';

@inject(AppStore)
export class Account {

    constructor(appStore) {
        this.appStore = appStore;
    }

    canActivate() {
        const account = this.appStore.getState().account;

        if (!account || !account.id) {
            return new Redirect('login');
        }
    }
}
