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
        this.updateFromStore();
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    attached() {
        this.$element = $(this.element);
        this.$chart = this.$element.find('.chart');

        this.width = Math.max(this.$element.parent().width(), 900);
        this.height = this.width * 0.4;

        this.svg = d3.select(this.$chart[0]).append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    }

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;

        if (this.orderbook !== exchange.orderbook) {
            this.orderbook = exchange.orderbook;

            if (this.orderbook.bids) {
                this.svg.selectAll('*').remove();
                const orders = this.orderbook.bids
                    .map(b => {
                        const converted = this.orderAmount.toView(b, false, false);
                        return {
                            type: 'bid',
                            total: converted.amount,
                            price: b.price
                        };
                    })
                    .concat(
                        this.orderbook.asks
                            .map(a => {
                                const converted = this.orderAmount.toView(a, true, false);
                                return {
                                    type: 'ask',
                                    total: converted.amount,
                                    price: a.price
                                };
                            })
                    );

                this.draw(orders, this.svg);
            }
        }
    }

    async refresh() {
        this.appStore.dispatch(this.exchangeActionCreators.refreshOrderbook());
    }

    draw(unsortedData, target) {
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = target.node().clientWidth - margin.left - margin.right;
        const height = target.node().clientHeight - margin.top - margin.bottom;
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        const g = target.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const data = unsortedData.sort((a, b) => (a.price > b.price ? 1 : -1));

        x.domain([
            d3.min(data, d => d.price),
            d3.max(data, d => d.price) + 1
        ]);
        y.domain([0, d3.max(data, d => d.total)]);

        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(y));

        // Define the div for the tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'orderbook-visualisation-tooltip')
            .style('position', 'absolute')
            .style('top', `${target.node().parentNode.offsetTop}px`)
            .style('left', `${(target.node().parentNode.offsetLeft + margin.left + (width / 2)) - 100}px`)
            .style('width', '200px')
            .style('opacity', 0)
            .html('');

        g.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', d => `bar ${d.type}`)
            .attr('x', d => x(d.price))
            .attr('y', d => y(d.total))
            .attr('width', (d, i) => {
                // is there a next element and do they have the same type:
                // fill until the next order
                if (data[i + 1] && data[i + 1].type === d.type) {
                    return x(data[i + 1].price) - x(d.price);
                    // is there a next element and they don't have the same type:
                    // market price valley
                } else if (data[i + 1]) {
                    return (x.range()[1] - x.range()[0]) / data.length;
                }
                // this is the last element: fill until the end of the graph
                return x.range()[1] - x(d.price);
            })
            .attr('height', d => height - y(d.total))
            .on('mouseover', (d) => {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 1);

                let html = '<table>';

                Object.keys(d).forEach((key) => {
                    html += `<tr><td><b>${key}</b></td><td>${d[key]}</td></tr>`;
                });

                html += '</table>';

                tooltip.html(html);
            })
            .on('mouseout', () =>
                tooltip.transition().duration(500).style('opacity', 0)
            );
    };
}
