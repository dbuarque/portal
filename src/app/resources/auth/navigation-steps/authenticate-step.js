/**
 * Created by Ishai on 4/3/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import {Redirect} from 'aurelia-router';
import {AppStore} from 'resources';

@inject(AppStore)
export default class AuthenticateStep {

    constructor(appStore) {
        this.appStore = appStore;
    }

    run(navigationInstruction, next) {

        if (navigationInstruction.config.name === 'account') {
            return this.appStore.keyPair ? next() : next.cancel(new Redirect('/login'));
        }

        return next();
    }
}
