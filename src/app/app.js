import {PLATFORM} from 'aurelia-pal';
import URI from 'urijs';
import {AppConfig} from './app-config';
import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {AuthenticateStep, JsonClient} from 'app-resources';

@inject(AppConfig, JsonClient)
export class App {

    constructor(appConfig, jsonClient) {
        this.config = appConfig;
        this.jsonClient = jsonClient;
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

    registerNavigationSteps(routerConfig) {
        routerConfig.addPipelineStep('authorize', AuthenticateStep);
    }
}
