/**
 * Created by istrauss on 3/19/2017.
 */

import _throttle from 'lodash/throttle';
import {inject} from 'aurelia-framework';
import techan from 'techan';
import {Store, connected} from 'aurelia-redux-connect';
import {FormatNumberValueConverter} from 'app-resources';

@inject(Element, Store, FormatNumberValueConverter)
export class OrderbookChartCustomElement {
    @connected('exchange.assetPair')
    assetPair;

    @connected('exchange.detail.orderbook')
    orderbook;

    loading = 0;
    numRefreshes = 0;
    noData = false;

    constructor(element, store, formatNumber) {
        this.element = element;
        this.store = store;
        this.formatNumber = formatNumber;

        this.move = _throttle(this._move.bind(this), 100);
        //this.refresh = _throttle(this._refresh.bind(this), 250);
    }

    attached() {
        //this.unsubscribeFromStore = this.store.subscribe(this.updateFromStore.bind(this));

        this.$element = $(this.element);
        this.$chart = this.$element.find('.chart');

        this.margin = {top: 0, right: 3, bottom: 20, left: 100};
        this.width = this.$element.parent().width() - this.margin.left - this.margin.right;
        this.height = 230;

        this.x = d3.scaleLinear()
            .range([0, this.width]);

        this.y = d3.scaleLinear().range([this.height, 0]);

        this.xAxis = d3.axisBottom(this.x)
            .tickFormat(num => this.formatNumber.toView(num, 3))
            .ticks(6);

        this.yAxis = d3.axisLeft(this.y)
            .tickFormat(num => this.formatNumber.toView(num, 3));

        this.askArea = d3.area()
            .curve(d3.curveStepAfter)
            .x(d => this.x(parseFloat(d.price, 10)))
            .y0(this.height)
            .y1(d => this.y(d.sellingDepth));

        this.bidArea = d3.area()
            .curve(d3.curveStepAfter)
            .x(d => this.x(parseFloat(d.price, 10)))
            .y0(this.height)
            .y1(d => this.y(d.sellingDepth));

        this.yAnnotation = techan.plot.axisannotation()
            .axis(this.yAxis)
            .orient('left')
            .width(90)
            .format(num => this.formatNumber.toView(num, 3));

        this.xAnnotation = techan.plot.axisannotation()
            .axis(this.xAxis)
            .orient('bottom')
            .format(num => this.formatNumber.toView(num, 3))
            .width(65)
            .translate([0, this.height]);

        this.crosshair = techan.plot.crosshair()
            .xScale(this.x)
            .yScale(this.y)
            .xAnnotation([this.xAnnotation])
            .yAnnotation([this.yAnnotation])
            .on('enter', this.enter.bind(this))
            .on('out', this.out.bind(this))
            .on('move', this.move.bind(this));

        this.svg = d3.select(this.$chart[0]).append('svg')
            .attr('class', 'main-chart')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.isAttached = true;

        this.draw();
    }

    async orderbookChanged() {
        this.draw();
    }

    draw() {
        if (!this.svg) {
            return;
        }

        this.svg.selectAll('*').remove();

        if (
            !this.assetPair ||
            !this.orderbook ||
            (this.orderbook.bids.length === 0 && this.orderbook.asks.length === 0)
        ) {
            return;
        }

        this.bids = this.orderbook.bids;
        this.asks = this.orderbook.asks;

        // We want to make sure the orderbook is equally deep on either side.
        if (this.bids.length > 1 && this.asks.length > 1) {
            const asksDepth = parseFloat(this.asks[this.asks.length - 1].price, 10) - parseFloat(this.asks[0].price, 10);
            const bidsDepth = parseFloat(this.bids[0].price, 10) - parseFloat(this.bids[this.bids.length - 1].price, 10);
            const depth = Math.min(asksDepth, bidsDepth);

            // We now have the depth for both sides, let's apply it
            if (asksDepth === depth) {
                const minPrice = parseFloat(this.bids[0].price, 10) - depth;
                this.bids = this.bids.filter(b => b.price >= minPrice);
                this.bids.push({
                    ...this.bids[this.bids.length - 1],
                    price: minPrice
                });
            }
            else {
                const maxPrice = parseFloat(this.asks[0].price, 10) + depth;
                this.asks = this.asks.filter(a => a.price <= maxPrice);
                this.asks.push({
                    ...this.asks[this.asks.length - 1],
                    price: maxPrice
                });
            }

            // add a little bit of width to the orders on the ends (that way they don't just appear as lines)
            //this.bids.push({
            //    ...this.bids[this.bids.length - 1],
            //    price: parseFloat(this.bids[this.bids.length - 1].price, 10) * 0.095
            //});
            //this.asks.push({
            //    ...this.asks[this.asks.length - 1],
            //    price: parseFloat(this.asks[this.asks.length - 1].price, 10) * 1.05
            //});
        }

        const xStart = this.bids.length > 0 ? this.bids[this.bids.length - 1].price : this.asks[0].price;
        const xEnd = this.asks.length > 0 ? this.asks[this.asks.length - 1].price : this.bids[0].price;
        const xDomain = [
            parseFloat(xStart.toString().slice(0, 10), 10),
            parseFloat(xEnd.toString().slice(0, 10), 10)
        ];
        const yDomain = [0, 0];

        yDomain[1] = Math.max.apply(
            undefined,
            this.bids
                .map(b => b.sellingDepth)
                .concat(
                    this.asks.map(a => a.sellingDepth)
                )
                .map(s => parseFloat(s.toString().slice(0, 10), 10))
        );

        yDomain[1] = yDomain[1] * (1 + 50 / this.height);

        this.x.domain(xDomain);
        this.y.domain(yDomain);

        //Calculate how far away the y axis labels need to be.
        const yDomainWidth = this.calculateAxisWidth(yDomain);

        this.svg.append('text')
            .attr('x', this.height * 0.45)
            .attr('y', 20 + yDomainWidth * 7)
            .attr('transform', 'rotate(90)')
            .text('Depth (' + this.assetPair.selling.code + ')');

        const xAxisSvg = this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxis);

        xAxisSvg.append('path')
            .attr('class', 'axis-line')
            .attr('d', 'M -' + this.margin.left + ',0 V -0.5 H ' + (this.width + this.margin.right) + ' V 0');

        const yAxisSvg = this.svg.append('g')
            .attr('class', 'y axis')
            .call(this.yAxis);

        yAxisSvg.append('path')
            .attr('class', 'axis-line')
            .attr('d', 'M 0,' + (this.height + this.margin.bottom + 5) + ' H -0.5 V -0.5 H 0');

        this.svg.append('path')
            .datum(this.asks)
            .attr('class', 'ask-area')
            .attr('d', this.askArea);

        this.svg.append('path')
            .datum(this.bids)
            .attr('class', 'bid-area')
            .attr('d', this.bidArea);

        this.svg.append('g')
            .attr('class', 'crosshair')
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
        this.mouseInside = true;
    }

    out() {
        this.currentData = undefined;
        this.mouseInside = false;
    }

    _move(coords) {
        if (!this.mouseInside) {
            return;
        }

        this.currentData = this.findLastGreaterThanOrEqual(coords.x, this.orderbook.bids, b => parseFloat(b.price, 10));

        if (this.currentData) {
            this.currentData.type = 'bid';
        }
        else {
            this.currentData = this.findLastLessThanOrEqual(coords.x, this.orderbook.asks, a => parseFloat(a.price, 10));

            if (this.currentData) {
                this.currentData.type = 'ask';
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
