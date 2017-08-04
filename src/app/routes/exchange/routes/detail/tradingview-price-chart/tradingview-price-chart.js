/**
 * Created by istrauss on 8/4/2017.
 */


import {inject, bindable} from 'aurelia-framework';
import Config from './';

@inject(Config)
export class TradingviewPriceChartCustomElement {

    constructor(config) {
        this.config = config;
    }
}
