import {PLATFORM} from 'aurelia-pal';
//import URI from 'urijs';
import {AppConfig} from './app-config';
import {inject} from 'aurelia-framework';
import {JsonClient} from 'app-resources';

@inject(AppConfig, JsonClient)
export class App {

    constructor(appConfig, jsonClient) {
        this.config = appConfig;
        this.jsonClient = jsonClient;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;
    }
    activate() {
        this.jsonClient.configure();
    }
}
