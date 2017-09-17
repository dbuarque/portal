/**
 * Created by istrauss on 3/16/2017.
 */

import {inject} from 'aurelia-framework';
import Config from './exchange-config';
import {ExchangeActionCreators} from './exchange-action-creators';
import {OrderbookUpdater} from './orderbook-updater';

@inject(Config, OrderbookUpdater,ExchangeActionCreators)
export class Exchange {

    constructor(config, orderbookUpdater, exchangeActionCreators) {
        this.config = config;
        this.exchangeActionCreators = exchangeActionCreators;

        orderbookUpdater.init();
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }
}
