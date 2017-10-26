/**
 * Created by istrauss on 8/4/2017.
 */

import moment from 'moment';
import {inject, bindable} from 'aurelia-framework';
import {Store, connected} from 'au-redux';
import Config from './tradingview-price-chart-config';
import {TradingviewBarsRealtimeUpdater} from './tradingview-bars-realtime-updater';
import {timeFrameToAmountScale} from './tradingview-price-chart-utils'

@inject(Config, Store, TradingviewBarsRealtimeUpdater)
export class TradingviewPriceChartCustomElement {

    @connected('exchange.assetPair')
    assetPair;

    get symbol() {
        return this.assetPair ?
            this.assetPair.buying.type + '|' +
            this.assetPair.buying.code + '|' +
            (this.assetPair.buying.type.toLowerCase() === 'native' ? 'Stellar' : this.assetPair.buying.issuer.accountId) + '|' +
            this.assetPair.selling.type + '|' +
            this.assetPair.selling.code + '|' +
            (this.assetPair.selling.type.toLowerCase() === 'native' ? 'Stellar' : this.assetPair.selling.issuer.accountId) :
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
        // Stop the real time updater.
        this.rtUpdater.stop();

        if (this.intervalSubscriptionObj) {
            this.intervalSubscriptionObj.unsubscribeAll(this);
        }

        if (this.widget) {
            // Try running the widget's remove method (not sure what it does really but let's execute it for good measure).
            try {
                // Will error out because the #tradingview-price-chart-container no longer can be accessed via the DOM
                this.widget.remove();
            }
            catch(e) {}

            delete this.widget;
        }

        this.isAttached = false;
    }

    assetPairChanged() {
        this.updateChart();
    }

    updateChart() {
        const self = this;
        
        if (!self.isAttached) {
            return;
        }

        if (!self.widget) {
            self.config.symbol = self.symbol;
            self.widget = new TradingView.widget(self.config);
            self.widget.onChartReady((() => {
                self.intervalSubscriptionObj = self.widget.chart().onIntervalChanged();
                self.intervalSubscriptionObj.subscribe(self, self.onIntervalChanged);
            }));

            self.currentResolution = self.config.interval;
            
        }
        else {
            self.widget.setSymbol(self.symbol, this.currentResolution)
        }
    }

    onIntervalChanged(interval, obj) {
        this.currentResolution = interval;
    }

    setTimeframe(tf) {
        if (!this.widget) {
            return;
        }

        const amountScale = timeFrameToAmountScale(tf);

        this.widget.chart().setVisibleRange({
            from: moment().subtract(amountScale.amount, amountScale.scale).unix(),
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
