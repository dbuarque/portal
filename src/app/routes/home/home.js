import './home.scss';
import {inject, computedFrom} from 'aurelia-framework';
import {connected} from 'aurelia-redux-connect';
import {AppConfig} from '../../app.config';

@inject(AppConfig)
export class Home {
    @connected('myAccount')
    account;

    @computedFrom('account')
    get enabledRoutes() {
        return this.appConfig.routes
            .filter(r => r.nav && this.isRouteEnabled(r));
    }

    @computedFrom('account')
    get disabledRoutes() {
        return this.appConfig.routes
            .filter(r => r.nav && !this.isRouteEnabled(r));
    }

    constructor(appConfig) {
        this.appConfig = appConfig;
    }

    isRouteEnabled(route) {
        return (!route.accountRequired && !route.anonymousRequired) ||
            route.accountRequired && this.account ||
            route.anonymousRequired && !this.account;
    }
}
