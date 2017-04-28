/**
 * Created by istrauss on 4/25/2017.
 */

import {inject, bindable} from 'aurelia-framework';
import {AppStore} from 'global-resources';
//import Config from './';

@inject(AppStore)
export class Assets {

    constructor(appStore) {
        this.config = appStore;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const state = this.appStore.getState();
        this.account = state.account;
    }

    refresh() {
        if (this.account.updating) {
            return;
        }

        this.appStore.dispatch(this.appActionCreators.updateAccount());
    }
}
