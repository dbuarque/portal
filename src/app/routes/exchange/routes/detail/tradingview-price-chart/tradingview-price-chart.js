/**
 * Created by istrauss on 8/4/2017.
 */

import moment from 'moment';
import {inject, TaskQueue, computedFrom} from 'aurelia-framework';
import {Store, connected} from 'aurelia-redux-connect';
import {TradingviewPriceChartConfig} from './tradingview-price-chart.config';
import {timeFrameToAmountScale, BarsRealtimeUpdater} from './resources';

@inject(TaskQueue, TradingviewPriceChartConfig, Store, BarsRealtimeUpdater)
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

    @computedFrom('chartReady')
    get availableStudies() {
        return this.chartReady ?
            this.widget.getStudiesList() :
            [];
    }

    displayedStudies = {};

    constructor(taskQueue, config, store, rtUpdater) {
        this.taskQueue = taskQueue;
        this.config = config;
        this.store = store;
        this.rtUpdater = rtUpdater;
    }

    attached() {
        const self = this;

        self.isAttached = true;
        this.taskQueue.queueTask(() => {
            self.updateChart();
        });
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
            catch (e) {}

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

            const Widget = TradingView.widget;

            self.widget = new Widget(self.config);

            self.widget.onChartReady(() => {
                self.intervalSubscriptionObj = self.widget.chart().onIntervalChanged();
                self.intervalSubscriptionObj.subscribe(self, self.onIntervalChanged);
                self.chartReady = true;
            });

            self.currentResolution = self.config.interval;
        }
        else {
            self.widget.setSymbol(self.symbol, self.currentResolution);
        }
    }

    toggleStudy(e) {

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
