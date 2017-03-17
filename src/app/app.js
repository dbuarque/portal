
import URI from 'urijs';
import {AppConfig} from './app-config';
import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {AuthenticateStep} from './auth/navigation-steps/navigation-steps';

@inject(AppConfig)
export class App {

    constructor(appConfig) {
        this.config = appConfig;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.registerNavigationSteps(routerConfig);

        this.router = router;
    }

    registerNavigationSteps(routerConfig) {
        routerConfig.addPipelineStep('authorize', AuthenticateStep);
    }
}
