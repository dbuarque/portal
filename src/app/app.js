import {PLATFORM} from 'aurelia-pal';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
import {AppConfig} from './app-config';
import {inject} from 'aurelia-framework';
 import {Store} from 'au-redux';
import {JsonClient, AuthenticateStep} from 'app-resources';
import {AppActionCreators} from './app-action-creators';
import {AccountEffectAlerter} from './account-effect-alerter';

@inject(AppConfig, HttpClient, Router, Store, JsonClient, AppActionCreators, AccountEffectAlerter)
export class App {

    constructor(appConfig, httpClient, router, store, jsonClient, appActionCreators, accountEffectAlerter) {
        this.config = appConfig;
        this.store = store;
        this.jsonClient = jsonClient;
        this.router = router;
        this.appActionCreators = appActionCreators;

        accountEffectAlerter.init();

        httpClient.configure(config => {
            config.useStandardConfiguration();
        });
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.registerNavigationSteps(routerConfig);

        this.router = router;

        this.router.transformTitle = title => 'LuPoEx';
    }

    activate() {
        this.store.dispatch(this.appActionCreators.updateLupoexAccount());
        this.jsonClient.configure();
    }

    registerNavigationSteps(routerConfig) {
        routerConfig.addPipelineStep('authorize', AuthenticateStep);
    }
}
