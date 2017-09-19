/**
 * Created by istrauss on 8/4/2017.
 */

import moment from 'moment';
import {inject, bindable} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import Config from './tradingview-price-chart-config';
import {TradingviewBarsRealtimeUpdater} from './tradingview-bars-realtime-updater';

@inject(Config, Store, TradingviewBarsRealtimeUpdater)
export class TradingviewPriceChartCustomElement {

    @connected('exchange.assetPair')
    assetPair;

    get symbol() {
        return this.assetPair ?
            this.assetPair.buying.code + '_' + (this.assetPair.buying.issuer || 'native') + '_' + this.assetPair.selling.code + '_' + (this.assetPair.selling.issuer || 'native') :
            null;
    }

    constructor(config, store, rtUpdater) {
        this.config = config;
        this.store = store;
        this.rtUpdater = rtUpdater;
    }

    attached() {
        this.isAttached = true;
        this.updateChart()
    }

    detached() {
        this.rtUpdater.stop();
        delete this.widget;
    }

    assetPairChanged() {
        this.updateChart();
    }

    updateChart() {
        if (!this.isAttached) {
            return;
        }

        if (!this.widget) {
            this.config.symbol = this.symbol;
            this.widget = new TradingView.widget(this.config);
        }
        else {
            this.widget.setSymbol(this.symbol)
        }
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
