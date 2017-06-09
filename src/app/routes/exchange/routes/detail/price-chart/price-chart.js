/**
 * Created by istrauss on 5/23/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {PriceChartActionCreators} from './price-chart-action-creators';

@inject(AppStore, PriceChartActionCreators)
export class PriceChart {

    constructor(appStore, priceChartActionCreators) {
        this.appStore = appStore;
        this.priceChartActionCreators = priceChartActionCreators;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    async refresh() {
        await this.candlestickChart.refresh();
    }

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;
        const priceChart = exchange.detail.priceChart;

        this.assetPair = exchange.assetPair;
        this.interval = priceChart.interval;
        this.start = priceChart.start;
        this.end = priceChart.end;
        this.intervalOptions = priceChart.intervalOptions;
        this.rangeOptions = priceChart.rangeOptions;
        this.presetRangeIndex = priceChart.presetRangeIndex;
    }

    setInterval(interval) {
        this.appStore.dispatch(this.priceChartActionCreators.updateInterval(interval));
    }

    setRange(rangeIndex) {
        this.appStore.dispatch(this.priceChartActionCreators.presetRange(rangeIndex));
    }
}
