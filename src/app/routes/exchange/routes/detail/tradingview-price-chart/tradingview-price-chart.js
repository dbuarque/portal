/**
 * Created by istrauss on 8/4/2017.
 */


import {inject, bindable} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import Config from './tradingview-price-chart-config';

@inject(Config, AppStore)
export class TradingviewPriceChartCustomElement {

    constructor(config, appStore) {
        this.config = config;
        this.appStore = appStore;
    }

    attached() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    detached() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        if (!this.assetPair) {
            this.assetPair = this.appStore.getState().exchange.assetPair;
            this.updateChart();
        }
    }

    updateChart() {
        if (!this.chart) {
            this.createChart();
        }
    }

    createChart() {
        this.config.symbol = this.assetPair.buying.code + '_' + (this.assetPair.buying.issuer || 'native') + '_' + this.assetPair.selling.code + '_' + (this.assetPair.selling.issuer || 'native');
        this.chart = new TradingView.widget(this.config);
    }
}
