/**
 * Created by istrauss on 5/23/2017.
 */

import {inject} from 'aurelia-framework';
 import {Store} from 'au-redux';
import {PriceChartActionCreators} from './price-chart-action-creators';

@inject(Store, PriceChartActionCreators)
export class PriceChart {

    constructor(store, priceChartActionCreators) {
        this.store = store;
        this.priceChartActionCreators = priceChartActionCreators;
    }

    bind() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    async refresh() {
        await this.candlestickChart.refresh();
    }

    updateFromStore() {
        const newState = this.store.getState();
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
        this.store.dispatch(this.priceChartActionCreators.updateInterval(interval));
    }

    setRange(rangeIndex) {
        this.store.dispatch(this.priceChartActionCreators.presetRange(rangeIndex));
    }
}
