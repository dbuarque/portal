import {PLATFORM} from 'aurelia-pal';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
//import URI from 'urijs';
import {AppConfig} from './app-config';
import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {JsonClient, AuthenticateStep} from 'app-resources';
import {AppActionCreators} from './app-action-creators';

@inject(AppConfig, HttpClient, Router, AppStore, JsonClient, AppActionCreators)
export class App {

    constructor(appConfig, httpClient, router, appStore, jsonClient, appActionCreators) {
        this.config = appConfig;
        this.appStore = appStore;
        this.jsonClient = jsonClient;
        this.router = router;
        this.appActionCreators = appActionCreators;

        httpClient.configure(config => {
            config.useStandardConfiguration();
        });
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.registerNavigationSteps(routerConfig);

        this.router = router;
    }

    activate() {
        this.appStore.dispatch(this.appActionCreators.updateLupoexAccount());
        this.jsonClient.configure();
    }

    attached() {
        const i = this.router;
    }

    registerNavigationSteps(routerConfig) {
        routerConfig.addPipelineStep('authorize', AuthenticateStep);
    }
}
