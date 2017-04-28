import {PLATFORM} from 'aurelia-pal';
//import URI from 'urijs';
import {AppConfig} from './app-config';
import {inject} from 'aurelia-framework';
import {JsonClient, AccountSyncer} from 'app-resources';

@inject(AppConfig, JsonClient, AccountSyncer)
export class App {

    constructor(appConfig, jsonClient, accountSyncer) {
        this.config = appConfig;
        this.jsonClient = jsonClient;
        this.accountSyncer = accountSyncer;

        this.accountSyncer.init();
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
