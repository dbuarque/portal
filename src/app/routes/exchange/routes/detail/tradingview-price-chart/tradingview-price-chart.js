/**
 * Created by istrauss on 8/4/2017.
 */

import moment from 'moment';
import {inject, bindable} from 'aurelia-framework';
 import {Store} from 'au-redux';
import Config from './tradingview-price-chart-config';

@inject(Config, Store)
export class TradingviewPriceChartCustomElement {

    constructor(config, store) {
        this.config = config;
        this.store = store;
    }

    attached() {
        this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    detached() {
        this.unsubscribeFromStore();

        this.widget.remove();
    }

    updateFromStore() {
        if (!this.assetPair) {
            this.assetPair = this.store.getState().exchange.assetPair;
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
        this.widget = new TradingView.widget(this.config);
    }

    setTimeframe(tf) {
        if (!this.widget) {
            return;
        }

        const scaleMap = {
            hr: 'hours',
            d: 'days',
            mo: 'months',
            y: 'years'
        };

        let scale;
        let amount;

        for (let k = 0; k < Object.keys(scaleMap).length; k++) {
            const key = Object.keys(scaleMap)[k];

            if (tf.text.indexOf(key) > -1) {
                scale = scaleMap[key];
                amount = parseInt(tf.text.replace(key, ''), 10);
                break;
            }
        }

        this.widget.chart().setVisibleRange({
            from: moment().subtract(amount, scale).unix(),
            to: moment().unix()
        });
    }

    setResolution(r) {
        if (!this.widget) {
            return;
        }

        this.widget.chart().setResolution(r.resolution);
    }
}
