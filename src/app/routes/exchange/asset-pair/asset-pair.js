/**
 * Created by istrauss on 3/17/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'utils';
import Config from './asset-pair-config';

@inject(Config, AppStore)
export class AssetPair {
    constructor(config, appStore) {
        this.config = config;
        this.appStore = appStore;
    }

    bind() {

    }

    updateFromStore() {

    }
}
