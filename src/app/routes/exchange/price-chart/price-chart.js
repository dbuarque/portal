/**
 * Created by istrauss on 3/19/2017.
 */

import {inject} from 'aurelia-framework';
import techan from 'techan';
import {StellarServer, AppStore, ObserverManager, ObservationInstruction} from 'resources';
import {TickerResource} from 'app-resources';

@inject(Element, StellarServer, AppStore, ObserverManager, TickerResource)
export class PriceChartCustomElement {

    loading = 0;
    interval = "86400";
    noData = false;

    constructor(element, stellarServer, appStore, observerManager, tickerResource) {
        this.element = element;
        this.stellarServer = stellarServer;
        this.appStore = appStore;
        this.observerManager = observerManager;
        this.tickerResource = tickerResource;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
        this.subscribeObservers();
    }

    unbind() {
        this.unsubscribeFromStore();
        this.observerManager.unsubscribe();
    }

    attached() {
        this.$element = $(this.element);
        this.$chart = this.$element.find('.chart');


        const margin = {top: 20, right: 20, bottom: 30, left: 50};
        this.width = this.$element.find('.price-chart').width() - margin.left - margin.right - 30;
        this.height = this.width * 0.5 - margin.top - margin.bottom - 30;

        this.x = techan.scale.financetime()
            .range([0, this.width]);

        this.y = d3.scaleLinear()
            .range([this.height, 0]);

        this.candlestick = techan.plot.candlestick()
            .xScale(this.x)
            .yScale(this.y);

        this.xAxis = d3.axisBottom()
            .scale(this.x);

        this.yAxis = d3.axisLeft()
            .scale(this.y);

        this.svg = d3.select(this.$chart[0]).append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.accessor = this.candlestick.accessor();
    }

    subscribeObservers() {
        const instructions = [
            new ObservationInstruction(this, 'start', this.refresh.bind(this)),
            new ObservationInstruction(this, 'end', this.refresh.bind(this))
        ];

        this.observerManager.subscribe(instructions);
    }

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;

        if (this.assetPair !== exchange.assetPair) {
            this.assetPair = exchange.assetPair;
            this.refresh();
        }
    }

    async refresh() {
        if (!this.assetPair) {
            return;
        }

        this.loading++;

        const values = await Promise.all([
            this.tickerResource.list(this.interval, this.assetPair, this.start, this.end),
            this.start ? this.tickerResource.lastPrevious(this.interval, this.assetPair, this.start) : Promise.resolve([])
        ]);

        const rawData = values[0];

        this.noData = rawData.length === 0;
        if (this.noData) {
            return;
        }

        const lastPreviousDatum = values[1][0];
        let start = this.start;
        let end = this.end;

        if (start && !lastPreviousDatum) {
            start = new Date(rawData[0].begin_ts);
        }

        const fullData = this.getFullData(rawData, lastPreviousDatum, start, end);
        this.draw(fullData);

        this.loading--;
    }

    getFullData(rawData, lastPreviousDatum, start, end) {
        start = new Date(start || rawData[0].begin_ts);
        end = end ? new Date(end) : new Date();
        const data = [];

        if (lastPreviousDatum) {
            lastPreviousDatum = this.lastPreviousDatum(lastPreviousDatum);
        }

        let i = 0;
        let d = start;
        while(moment(d).isSameOrBefore(end)) {
            if (i < rawData.length && moment(d).isSameOrAfter(rawData[i].begin_ts)) {
                data.push(this.mapDatumForGraph(rawData[i]));
                lastPreviousDatum = this.lastPreviousDatum(rawData[i]);
                i++;
            }
            else {
                data.push({
                    ...lastPreviousDatum,
                    date: new Date(d.valueOf())
                })
            }
            d = this.addSeconds(d, parseInt(this.interval, 10));
        }

        return data;
    }

    lastPreviousDatum(rawDatum) {
        return {
            open: rawDatum.close,
            high: rawDatum.close,
            low: rawDatum.close,
            close: rawDatum.close,
            volume: 0
        };
    }
    
    mapDatumForGraph(rawDatum) {
        return {
            date: new Date(rawDatum.begin_ts),
            open: rawDatum.open,
            high: rawDatum.high,
            low: rawDatum.low,
            close: rawDatum.close,
            volume: rawDatum.bought_vol
        };
    }

    draw(data) {
        data = data
            .sort((a, b) => {
                return d3.ascending(this.accessor.d(a), this.accessor.d(b));
            });

        this.svg.selectAll('*').remove();

        this.svg.append("g")
            .attr("class", "candlestick");

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")");

        this.svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

        this.x.domain(data.map(this.candlestick.accessor().d));
        this.y.domain(techan.scale.plot.ohlc(data, this.candlestick.accessor()).domain());

        this.svg.selectAll("g.candlestick").datum(data).call(this.candlestick);
        this.svg.selectAll("g.x.axis").call(this.xAxis);
        this.svg.selectAll("g.y.axis").call(this.yAxis);
    }

    addSeconds(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }
}
