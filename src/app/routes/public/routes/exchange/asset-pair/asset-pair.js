/**
 * Created by istrauss on 3/17/2017.
 */

import {inject} from 'aurelia-framework';
import Config from './asset-pair-config';

@inject(Config)
export class AssetPair {
    constructor(config) {
        this.config = config;
    }
}
