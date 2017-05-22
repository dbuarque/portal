/**
 * Created by istrauss on 3/16/2017.
 */

import {inject} from 'aurelia-framework';
import Config from './exchange-config';

@inject(Config)
export class Exchange {

    constructor(config) {
        this.config = config;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;
    }
}
