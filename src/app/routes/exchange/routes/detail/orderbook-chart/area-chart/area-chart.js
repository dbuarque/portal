/**
 * Created by istrauss on 3/19/2017.
 */

import _throttle from 'lodash.throttle';
import _find from 'lodash.find';
import {inject} from 'aurelia-framework';
import techan from 'techan';
import {AppStore, ObservationInstruction} from 'global-resources';
import {FormatNumberValueConverter} from 'app-resources';

@inject(Element, AppStore, FormatNumberValueConverter)
export class AreaChartCustomElement {

    loading = 0;
    numRefreshes = 0;
    noData = false;

    constructor(element, appStore, formatNumber) {
        this.element = element;
        this.appStore = appStore;
        this.formatNumber = formatNumber;

        this.move = _throttle(this._move.bind(this), 100);
        this.refresh = _throttle(this._refresh.bind(this), 250);
    }

    attached() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));

        this.$element = $(this.element);
        this.$chart = this.$element.find('.chart');

        this.margin = {top: 0, right: 3, bottom: 20, left: 100};
        this.width = this.$element.parent().width() - this.margin.left - this.margin.right;
        this.height = this.width * 0.4 - this.margin.top - this.margin.bottom;

        this.x = d3.scaleLog()
            .base(Math.E)
            .range([0, this.width]);

        this.y = d3.scaleLinear().range([this.height, 0]);

        this.xAxis = d3.axisBottom(this.x)
            .tickFormat(num => this.formatNumber.toView(num, 3));

        this.yAxis = d3.axisLeft(this.y)
            .tickFormat(num => this.formatNumber.toView(num, 3));

        this.askArea = d3.area()
            .curve(d3.curveStepAfter)
            .x(d => this.x(parseFloat(d.price, 10)))
            .y0(this.height - 2)
            .y1(d => this.y(d.selling_depth));

        this.bidArea = d3.area()
            .curve(d3.curveStepAfter)
            .x(d => this.x(parseFloat(d.price, 10)))
            .y0(this.height - 2)
            .y1(d => this.y(d.selling_depth));

        this.yAnnotation = techan.plot.axisannotation()
            .axis(this.yAxis)
            .orient('left')
            .width(90)
            .format(num => this.formatNumber.toView(num));

        this.xAnnotation = techan.plot.axisannotation()
            .axis(this.xAxis)
            .orient('bottom')
            .format(num => this.formatNumber.toView(num))
            .width(65)
            .translate([0, this.height]);

        this.crosshair = techan.plot.crosshair()
            .xScale(this.x)
            .yScale(this.y)
            .xAnnotation([this.xAnnotation])
            .yAnnotation([this.yAnnotation])
            .on("enter", this.enter.bind(this))
            .on("out", this.out.bind(this))
            .on("move", this.move.bind(this));

        this.svg = d3.select(this.$chart[0]).append("svg")
            .attr("class", "main-chart")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.isAttached = true;

        this.updateFromStore();
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

        this.assetPair = exchange.assetPair;

        if (this.orderbook !== exchange.orderbook ||
            this.start !== orderbookChart.start ||
            this.end !== orderbookChart.end
        ) {
            this.orderbook = exchange.orderbook;
            this.start = orderbookChart.start;
            this.end = orderbookChart.end;

            if (this.orderbook.bids) {
                this.bids = this.orderbook.bids.filter(b => 
                    (!this.start || parseFloat(b.price) >= this.start) &&
                    (!this.end || parseFloat(b.price) <= this.end)
                );
                this.asks = this.orderbook.asks.filter(a =>
                    (!this.start || parseFloat(a.price) >= this.start) &&
                    (!this.end || parseFloat(a.price) <= this.end)
                );
                this.refresh();
            }
        }
    }

    async _refresh() {
        await this.draw();
    }

    draw() {
        const xStart = this.bids.length > 0 ? this.bids[this.bids.length - 1].price : this.asks[0].price;
        const xEnd = this.asks.length > 0 ? this.asks[this.asks.length - 1].price : this.bids[0].price;
        const xDomain = [xStart, xEnd];
        const yDomain = [0, 0];

        yDomain[1] = Math.max.apply(
            undefined,
            this.bids.map(b => b.selling_depth)
                .concat(
                    this.asks.map(a => a.selling_depth)
                )
        );

        yDomain[1] = yDomain[1] * (1 + 50/this.height);

        this.x.domain(xDomain);
        this.y.domain(yDomain);

        this.svg.selectAll('*').remove();

        //Calculate how far away the y axis labels need to be.
        const yDomainWidth = this.calculateAxisWidth(yDomain);

        this.svg.append('text')
            .attr("x", this.height * 0.45)
            .attr("y", 20 + yDomainWidth * 7)
            .attr("transform", "rotate(90)")
            .text("Depth (" + this.assetPair.selling.code + ")");

        const xAxisSvg = this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

        xAxisSvg.append("path")
            .attr("class", "axis-line")
            .attr("d", "M -" + this.margin.left + ",0 V -0.5 H " + (this.width + this.margin.right) + " V 0");

        const yAxisSvg = this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);

        yAxisSvg.append("path")
            .attr("class", "axis-line")
            .attr("d", "M 0," + (this.height + this.margin.bottom + 5) + " H -0.5 V -0.5 H 0");

        this.svg.append("path")
            .datum(this.asks)
            .attr("class", "ask-area")
            .attr("d", this.askArea);

        this.svg.append("path")
            .datum(this.bids)
            .attr("class", "bid-area")
            .attr("d", this.bidArea);

        this.svg.append('g')
            .attr("class", "crosshair")
            .call(this.crosshair); // Display the current data

        this.removeZeroTickers(yAxisSvg);
    }

    calculateAxisWidth(domainArr) {
        return domainArr.reduce((result, element) => {
            const formattedNumber = this.formatNumber.toView(element, 3);
            const elementWidth = formattedNumber.split('').length;
            return Math.max(result, elementWidth);
        }, 0);
    }

    removeZeroTickers(axis) {
        axis.selectAll('g.tick text').each(function() {
            if (this.innerHTML === '0.00') {
                this.style.display = 'none';
            }
        });
    }

    enter() {
        this.currentData = undefined;
    }

    out() {
        this.currentData = undefined;
    }

    _move(coords) {
        this.currentData = this.findLastGreaterThanOrEqual(coords.x, this.bids, b => parseFloat(b.price, 10));

        if (this.currentData) {
            this.currentData.type = 'Bidding';
        }
        else {
            this.currentData = this.findLastLessThanOrEqual(coords.x, this.asks, a => parseFloat(a.price, 10));

            if (this.currentData) {
                this.currentData.type = 'Asking';
            }
        }
    }

    findLastGreaterThanOrEqual(point, array, comparer) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (comparer(array[i]) >= point) {
                return array[i];
            }
        }
    }

    findLastLessThanOrEqual(point, array, comparer) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (comparer(array[i]) <= point) {
                return array[i];
            }
        }
    }
}
