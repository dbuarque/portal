/**
 * Created by istrauss on 5/25/2017.
 */

import {inject} from 'aurelia-framework';
import {AppStore} from 'global-resources';
import {ExchangeActionCreators} from '../../../exchange-action-creators';
import {OrderAmountValueConverter} from '../../../exchange-value-converters';

@inject(Element, AppStore, ExchangeActionCreators, OrderAmountValueConverter)
export class OrderbookChartCustomElement {

    constructor(element, appStore, exchangeActionCreators, orderAmount) {
        this.element = element;
        this.appStore = appStore;
        this.exchangeActionCreators = exchangeActionCreators;
        this.orderAmount = orderAmount;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    attached() {
        this.$element = $(this.element);
        this.$chart = this.$element.find('.chart');

        this.margin ={ top: 20, right: 20, bottom: 30, left: 40 };
        this.width = Math.max(this.$element.parent().width(), 900);
        this.height = this.width * 0.4;

        this.svg = d3.select(this.$chart[0]).append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        this.isAttached = true;

        this.updateFromStore();
    }

    updateFromStore() {
        if (!this.isAttached) {
            return;
        }

        const newState = this.appStore.getState();
        const exchange = newState.exchange;

        if (this.orderbook !== exchange.orderbook) {
            this.orderbook = exchange.orderbook;

            if (this.orderbook.bids) {
                this.draw();
            }
        }
    }

    async refresh() {
        this.appStore.dispatch(this.exchangeActionCreators.refreshOrderbook());
    }

    draw() {
        const self = this;
        if (self.orderbook.bids.length === 0 && self.orderbook.asks.length === 0) {
            return;
        }

        const target = self.svg;
        const middleMarket = self.orderbook.bids.length > 0 && self.orderbook.asks.length > 0 ?
            parseFloat(self.orderbook.bids[0].price, 10) / parseFloat(self.orderbook.asks[0].price, 10) :
            self.orderbook.bids.length > 0 ?
                parseFloat(self.orderbook.bids[0].price, 10) :
                parseFloat(self.orderbook.asks[0].price, 10);
        const orders = self.orderbook.bids
            .map(b => {
                return {
                    type: 'bid',
                    total: self.orderAmount.toView(b, false, true),
                    price: parseFloat(b.price, 10)
                };
            })
            .concat(
                self.orderbook.asks
                    .map(a => {
                        return {
                            type: 'ask',
                            total: self.orderAmount.toView(a, true, true),
                            price: parseFloat(a.price, 10)
                        };
                    })
            );
        const margin = self.margin;
        const width = self.width - margin.left - margin.right;
        const height = self.height - margin.top - margin.bottom;
        self.x = d3.scaleLinear().range([0, width]);
        self.y = d3.scaleLinear().range([height, 0]);
        const zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", self.zoomed.bind(self));

        target.selectAll('*').remove();

        self.context = target.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        self.data = orders.sort((a, b) => (a.price > b.price ? 1 : -1));

        self.x.domain([
            d3.min(self.data, d => d.price),
            d3.max(self.data, d => d.price) + 1
        ]);
        self.y.domain([0, d3.max(self.data, d => d.total)]);

        self.xAxis = d3.axisBottom(self.x);

        self.context.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${height})`)
            .call(self.xAxis);

        self.context.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(self.y));

        target.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

        // Define the div for the tooltip
        self.tooltip = d3.select('body').append('div')
            .attr('class', 'orderbook-visualisation-tooltip')
            .style('position', 'absolute')
            .style('top', `${target.node().parentNode.offsetTop}px`)
            .style('left', `${(target.node().parentNode.offsetLeft + margin.left + (width / 2)) - 100}px`)
            .style('width', '200px')
            .style('opacity', 0)
            .html('');
        
        self.renderBars(self.data);
    }
    
    renderBars(data) {
        const self = this;

        self.context.selectAll('.bar').remove();

        self.context.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', d => `bar ${d.type}`)
            .attr('x', d => self.x(d.price))
            .attr('y', d => self.y(d.total))
            .attr('width', (d, i) => {
                // is there a next element and do they have the same type:
                // fill until the next order
                if (data[i + 1] && data[i + 1].type === d.type) {
                    return self.x(data[i + 1].price) - self.x(d.price);
                    // is there a next element and they don't have the same type:
                    // market price valley
                } else if (data[i + 1]) {
                    return (self.x.range()[1] - self.x.range()[0]) / data.length;
                }
                // self is the last element: fill until the end of the graph
                return self.x.range()[1] - self.x(d.price);
            })
            .attr('height', d => self.height - self.margin.top - self.margin.bottom - self.y(d.total))
            .on('mouseover', (d) => {
                self.tooltip.transition()
                    .duration(500)
                    .style('opacity', 1);

                let html = '<table>';

                Object.keys(d).forEach((key) => {
                    html += `<tr><td><b>${key}</b></td><td>${d[key]}</td></tr>`;
                });

                html += '</table>';

                self.tooltip.html(html);
            })
            .on('mouseout', () =>
                self.tooltip.transition().duration(500).style('opacity', 0)
            );
    }

    zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        const t = d3.event.transform;
        //this.x.domain(t.rescaleX(this.x).domain());
        //focus.select(".area").attr("d", area);
        this.context.select(".axis--x").call(this.xAxis);

        const xDomain = this.x.domain();
        this.renderBars(this.data.filter(d => d.price >= xDomain[0] && d.price <= xDomain[1]));
        //context.select(".brush").call(brush.move, this.x.range().map(t.invertX, t));
    }
}
