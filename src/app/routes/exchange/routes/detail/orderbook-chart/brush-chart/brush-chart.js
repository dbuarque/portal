/**
 * Created by istrauss on 5/23/2017.
 */

import {inject, TaskQueue} from 'aurelia-framework';
import techan from 'techan';
import {AppStore} from 'global-resources';
import {FormatNumberValueConverter} from 'app-resources';
import {OrderbookChartActionCreators} from '../orderbook-chart-action-creators';

@inject(Element, TaskQueue, AppStore, FormatNumberValueConverter, OrderbookChartActionCreators)
export class BrushChartCustomElement {

    loading = 0;

    constructor(element, taskQueue, appStore, formatNumber, orderbookChartActionCreators) {
        this.element = element;
        this. taskQueue = taskQueue;
        this.appStore = appStore;
        this.formatNumber = formatNumber;
        this.orderbookChartActionCreators = orderbookChartActionCreators;
    }

    attached() {
        //Not sure why it doesn't render correctly without this queue
        this.taskQueue.queueTask(() => {
            this.$element = $(this.element);
            this.$chart = this.$element.find('.chart');

            this.margin = {top: 0, right: 4, bottom: 20, left: 3};
            this.width = this.$element.parent().width() - this.margin.left - this.margin.right;
            this.height = 50;

            this.brush = d3.brushX()
                .extent([[0, 0], [this.width, this.height]])
                .on("end", this.brushed.bind(this));

            this.x = d3.scaleLinear()
                .range([0, this.width]);

            this.y = d3.scaleLinear().range([this.height, 0]);

            this.xAxis = d3.axisBottom(this.x)
                .tickFormat(num => this.formatNumber.toView(num, 2));

            this.askArea = d3.area()
                .curve(d3.curveStepAfter)
                .x(d => this.x(parseFloat(d.price, 10)))
                .y0(this.height)
                .y1(d => this.y(d.selling_depth));

            this.bidArea = d3.area()
                .curve(d3.curveStepAfter)
                .x(d => this.x(parseFloat(d.price, 10)))
                .y0(this.height)
                .y1(d => this.y(d.selling_depth));

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
        const orderbookChart = exchange.detail.orderbookChart;

        if (this.orderbook !== exchange.orderbook || this.assetPiar !== exchange.assetPair) {
            this.orderbook = exchange.orderbook;
            this.assetPiar = exchange.assetPair;

            if (this.orderbook.bids) {
                this.refresh();
            }
        }

        if (this.start !== orderbookChart.start || this.end !== orderbookChart.end) {
            this.start = orderbookChart.start;
            this.end = orderbookChart.end;

            this.adjustBrush();
        }
    }

    async refresh() {
        await this.draw();
    }

    draw() {
        if (this.orderbook.bids.length === 0 && this.orderbook.asks.length === 0) {
            return;
        }

        const xStart = this.orderbook.bids.length > 0 ? this.orderbook.bids[this.orderbook.bids.length - 1].price : this.orderbook.asks[0].price;
        const xEnd = this.orderbook.asks.length > 0 ? this.orderbook.asks[this.orderbook.asks.length - 1].price : this.orderbook.bids[0].price;
        const xDomain = [xStart, xEnd];
        const yDomain = [0, 0];

        yDomain[1] = Math.max.apply(
            undefined,
            this.orderbook.bids.map(b => b.selling_depth)
                .concat(
                    this.orderbook.asks.map(a => a.selling_depth)
                )
        );
        
        this.x.domain(xDomain);
        this.y.domain(yDomain);

        this.svg.selectAll('*').remove();

        const xAxisSvg = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.height + 1) + ")")
            .call(this.xAxis);

        this.svg.append("path")
            .datum(this.orderbook.asks)
            .attr("class", "ask-area")
            .attr("d", this.askArea);

        this.svg.append("path")
            .datum(this.orderbook.bids)
            .attr("class", "bid-area")
            .attr("d", this.bidArea);

        this.svg
            .call(this.brush)
            .selectAll("rect")
            .attr("height", this.height);

        this.adjustBrush();
    }

    adjustBrush() {
        const currentSelection = d3.brushSelection(this.svg);
        const newSelection = this.calculateBrushSelection();

        if (currentSelection && currentSelection[0] === newSelection[0] && currentSelection[1] === newSelection[1]) {
            return;
        }

        this.svg.call(this.brush.move, newSelection);
    }

    brushed() {
        const currentSelection = d3.brushSelection(this.svg._groups[0][0]);
        const newSelection = this.calculateBrushSelection();

        if (currentSelection && currentSelection[0] === newSelection[0] && currentSelection[1] === newSelection[1]) {
            return;
        }

        const start = this.x.invert(currentSelection[0]);
        const end = this.x.invert(currentSelection[1]);

        this.appStore.dispatch(this.orderbookChartActionCreators.updateRange({
            start: start || undefined,
            end: end || undefined
        }));
    }

    calculateBrushSelection() {
        const brushExtent = this.brush.extent()();
        const start = this.start || this.x.invert(brushExtent[0][0]);
        const end = this.end || this.x.invert(brushExtent[1][0]);

        let selectStart = this.x(start);
        let selectEnd = this.x(end);

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
