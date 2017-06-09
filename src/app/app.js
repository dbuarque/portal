import {PLATFORM} from 'aurelia-pal';
import {HttpClient} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
//import URI from 'urijs';
import {AppConfig} from './app-config';
import {inject} from 'aurelia-framework';
import {JsonClient, AuthenticateStep} from 'app-resources';

@inject(AppConfig, HttpClient, Router, JsonClient)
export class App {

    constructor(appConfig, httpClient, router, jsonClient) {
        this.config = appConfig;
        this.jsonClient = jsonClient;
        this.router = router;

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
        this.jsonClient.configure();
    }

    attached() {
        const i = this.router;
    }

    registerNavigationSteps(routerConfig) {
        routerConfig.addPipelineStep('authorize', AuthenticateStep);
    }
}
