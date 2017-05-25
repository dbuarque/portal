/**
 * Created by istrauss on 5/23/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {PriceChartActionCreators} from './price-chart-action-creators';

@inject(AppStore, PriceChartActionCreators)
export class PriceChart {

    intervalOptions  = [
        {
            interval: 60,
            label: '1m'
        },
        {
            interval: 5 * 60,
            label: '5m'
        },
        {
            interval: 15 * 60,
            label: '15m'
        },
        {
            interval: 60 * 60,
            label: '1h'
        },
        {
            interval: 4 * 60 * 60,
            label: '4h'
        },
        {
            interval: 24 * 60 * 60,
            label: '1d'
        }
    ];

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

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;
        const priceChart = exchange.detail.priceChart;

        this.assetPair = exchange.assetPair;
        this.interval = priceChart.interval;
        this.start = priceChart.start;
        this.end = priceChart.end;
    }

    setInterval(interval) {
        this.appStore.dispatch(this.priceChartActionCreators.updateData({interval}));
    }

    setRange(rangeOption) {

    }
}
