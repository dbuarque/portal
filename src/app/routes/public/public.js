/**
 * Created by istrauss on 4/22/2016.
 */

import {PublicConfig} from './public-config';
import {inject, singleton} from 'aurelia-framework';

@inject(PublicConfig)
export class Public {

    constructor(publicConfig) {
        this.config = publicConfig;
    }

    configureRouter(routerConfig, router) {
        this.router = router;

        routerConfig.options.pushState = true;
        routerConfig.map(this.config.routes);
    }
}
