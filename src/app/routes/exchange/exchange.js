/**
 * Created by istrauss on 3/16/2017.
 */

import './exchange.scss';
import {inject} from 'aurelia-framework';
import {ExchangeConfig} from './exchange.config';

@inject(ExchangeConfig)
export class Exchange {
    constructor(config) {
        this.config = config;
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }
}
