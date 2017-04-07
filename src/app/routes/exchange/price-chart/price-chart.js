/**
 * Created by istrauss on 3/19/2017.
 */

import {inject} from 'aurelia-framework';
import techan from 'techan';
import {StellarServer, AppStore} from 'resources';
import {TickerResource} from 'app-resources';

@inject(Element, AppStore, StellarServer, TickerResource)
export class PriceChartCustomElement {

    loading = 0;

    constructor(element, appStore, stellarServer, tickerResource) {
        this.element = element;
        this.appStore = appStore;
        this.stellarServer = stellarServer;
        this.tickerResource = tickerResource;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
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

        this.interval = 86400;
        this.refresh();
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
        //if (!this.assetPair || !this.interval) {
        //    return;
        //}
//
        //this.loading++;
        //
        //this.rawData = await this.tickerResource.list(this.interval, this.assetPair, this.start, this.end);
        this.rawData = await this.tickerResource.list(this.interval, {
            selling: {
                code: 'JPY',
                issuer: 'GBVAOIACNSB7OVUXJYC5UE2D4YK2F7A24T7EE5YOMN4CE6GCHUTOUQXM'
            },
            buying: {
                code: 'XLM'
            }
        }, this.start, this.end);
        this.draw();

        //this.loading--;
    }

    draw() {
        const fullData = this.getData();
        const data = fullData
            .map((d) => {
                return {
                    date: new Date(d.begin_ts),
                    open: d.open || 0,
                    high: d.high || 0,
                    low: d.low || 0,
                    close: d.close || 0,
                    volume: d.bought_vol || 0
                };
            }).sort((a, b) => {
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

    getData() {
        const start = new Date(this.start || this.rawData[0].begin_ts);
        const end = this.end ? new Date(this.end) : new Date();
        const data = [];

        let i = 0;
        let d = start;
        while(moment(d).isSameOrBefore(end)) {
            if (i < this.rawData.length && moment(d).isSameOrAfter(this.rawData[i].begin_ts)) {
                data.push(this.rawData[i]);
                i++;
            }
            else {
                data.push({
                    begin_ts: d.toISOString()
                })
            }
            d = this.addSeconds(d, parseInt(this.interval, 10));
        }

        return data;
    }

    addSeconds(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }
}
