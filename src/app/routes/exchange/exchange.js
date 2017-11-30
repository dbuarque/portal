/**
 * Created by istrauss on 3/16/2017.
 */

import './exchange.scss';
import {inject} from 'aurelia-framework';
import {ExchangeConfig} from './exchange.config';
import {UpdateAssetPairActionCreator} from './action-creators';

@inject(ExchangeConfig, UpdateAssetPairActionCreator)
export class Exchange {
    constructor(config, updateAssetPair) {
        this.config = config;

        updateAssetPair.initFromStore();
    }

    configureRouter(routerConfig, router) {
        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);

        this.router = router;

        this.router.transformTitle = title => false;
    }
}
