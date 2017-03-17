/**
 * Created by istrauss on 4/22/2016.
 */

import {inject} from 'aurelia-framework';
import {AccountConfig} from './account-config';

@inject(AccountConfig)
export class Account {

    constructor(accountConfig) {
        this.config = accountConfig;
    }

    configureRouter(routerConfig, router) {
        this.router = router;

        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);
    }
}
