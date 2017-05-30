/**
 * Created by istrauss on 5/23/2017.
 */

import {inject, TaskQueue} from 'aurelia-framework';
import techan from 'techan';
import {AppStore} from 'global-resources';
import {TickerResource} from 'app-resources';
import {DataProcessor} from '../data-processor';
import {PriceChartActionCreators} from '../price-chart-action-creators';

@inject(Element, TaskQueue, AppStore, TickerResource, DataProcessor, PriceChartActionCreators)
export class BrushChartCustomElement {

    loading = 0;

    constructor(element, taskQueue, appStore, tickerResource, dataProcessor, priceChartActionCreators) {
        this.element = element;
        this. taskQueue= taskQueue;
        this.appStore = appStore;
        this.tickerResource = tickerResource;
        this.dataProcessor = dataProcessor;
        this.priceChartActionCreators = priceChartActionCreators;
    }

    attached() {
        //Not sure why it doesn't render correctly without this queue
        this.taskQueue.queueTask(() => {
            this.$element = $(this.element);
            this.$chart = this.$element.find('.chart');

            this.margin = {top: 0, right: 1, bottom: 20, left: 1};
            this.width = Math.max(this.$element.parent().width() - this.margin.left - this.margin.right, 900 - this.margin.left - this.margin.right);
            this.height = 50;

            this.brush = d3.brushX()
                .extent([[this.margin.left, 0], [this.width - this.margin.right, this.height]])
                .on("end", this.brushed.bind(this));

            this.x = techan.scale.financetime()
                .range([0, this.width]);

            this.y = d3.scaleLinear()
                .range([this.height, 0]);

            this.xAxis = d3.axisBottom(this.x);

            this.close = techan.plot.close()
                .xScale(this.x)
                .yScale(this.y);

            this.svg = d3.select(this.$chart[0]).append("svg")
                .attr("width", this.width)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

            this.$chart.append($('<div class="axis-line"></div>'));

            this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));

            this.isAttached = true;

            this.updateFromStore();
        });
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        if (!this.isAttached) {
            return;
        }

        const newState = this.appStore.getState();
        const exchange = newState.exchange;
        const priceChart = exchange.detail.priceChart;

        if (this.assetPair !== exchange.assetPair ||
            this.start !== priceChart.start ||
            this.end !== priceChart.end
        ) {
            this.assetPair = exchange.assetPair;
            this.start = priceChart.start;
            this.end = priceChart.end;
            this.refresh();
        }

        this.interval = priceChart.interval;
    }

    async refresh() {
        if (!this.data) {
            await this.loadData();
        }

        if (!this.data) {
            return;
        }

        this.adjustBrush();
    }

    async loadData() {
        this.loading++;

        let rawData = await this.tickerResource.closeHistory(this.assetPair);

        if (rawData.length === 0) {
            this.loading--;
            return;
        }

        rawData = rawData.map(d => {
            d.begin_ts = new Date(d.begin_ts).toISOString().split('T')[0] + 'T00:00:00.000Z';
            return d;
        });

        this.data = this.dataProcessor.fillInData(rawData, {
            interval: 86400
        });

        this.xDomain = this.data.map(d => d.date);
        this.yDomain = rawData.reduce(
            (domain, d) => {
                domain[0] = domain[0] < d.close ? domain[0] : d.close;
                domain[1] = domain[1] > d.close ? domain[1] : d.close;
                return domain;
            },
            [
                this.data[0].close,
                this.data[0].close
            ]
        );

        this.yDomain[0] = this.yDomain[0] - 0.1 * this.yDomain[0];
        this.yDomain[1] = this.yDomain[1] * 1.1;

        this.x.domain(this.xDomain);
        this.y.domain(this.yDomain);

        this.svg.selectAll('*').remove();

        this.svg.append("g")
            .attr("class", "close");

        const xAxisSvg = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.height + 1) + ")")
            .call(this.xAxis);

        this.svg.datum(this.data).call(this.close);

        this.svg
            .call(this.brush)
            .selectAll("rect")
            .attr("height", this.height);

        this.loading--;
    }

    brushed() {
        const currentSelection = d3.brushSelection(this.svg._groups[0][0]);
        const newSelection = this.calculateBrushSelection();

        if (currentSelection && currentSelection[0] === newSelection[0] && currentSelection[1] === newSelection[1]) {
            return;
        }

        const start = moment(this.x.invert(currentSelection[0])).toISOString();
        const end = moment(this.x.invert(currentSelection[1])).toISOString();

        this.appStore.dispatch(this.priceChartActionCreators.updateRange({
            start: start || undefined,
            end: end || undefined
        }));
    }

    adjustBrush() {
        const currentSelection = d3.brushSelection(this.svg);
        const newSelection = this.calculateBrushSelection();

        if (currentSelection && currentSelection[0] === newSelection[0] && currentSelection[1] === newSelection[1]) {
            return;
        }

        this.svg.call(this.brush.move, newSelection);
    }

    calculateBrushSelection() {
        const brushExtent = this.brush.extent()();
        const start = this.start || moment(this.x.invert(brushExtent[0][0])).toISOString();
        const end = this.end || moment(this.x.invert(brushExtent[1][0])).toISOString();

        let selectStart = this.x(new Date(start));
        let selectEnd = this.x(new Date(end));

        if (selectStart > brushExtent[1][0]) {
            selectStart = brushExtent[1][0];
        }

        if (selectEnd > brushExtent[1][0]) {
            selectEnd = brushExtent[1][0];
        }

        if (selectEnd === selectStart) {
            selectStart = selectStart - 1;
        }

        return [selectStart, selectEnd];
    }
}
