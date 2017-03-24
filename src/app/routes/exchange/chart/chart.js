/**
 * Created by istrauss on 3/19/2017.
 */

import {inject} from 'aurelia-framework';
import d3 from 'd3';
import techan from 'techan';
import {StellarServer} from 'resources';
import {TickerResource} from 'app-resources';

@inject(Element, StellarServer, TickerResource)
export class chart {

    @bindable underlyingIssuer;
    @bindable underlyingCode;
    @bindable correspondingIssuer;
    @bindable correspondingCode;

    constructor(element, stellarServer, tickerResource) {
        this.element = element;
        this.stellarServer = stellarServer;
        this.tickerResource = tickerResource;
    }

    attached() {
        const $chart = $(this.element).find('.chart');
        const width = $chart.width();
        const height = $chart.height();

        this.x = techan.scale.financetime()
            .range([0, width]);

        this.y = d3.scaleLinear()
            .range([height, 0]);

        this.candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);

        this.xAxis = d3.axisBottom()
            .scale(x);

        this.yAxis = d3.axisLeft()
            .scale(y);

        this.svg = d3.select(this.element).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        this.accessor = candlestick.accessor();

        this.svg.append("g")
            .attr("class", "candlestick");

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

        this.svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");
    }

    underlyingIssuerChanged() {
        this.getData();
    }

    underlyingCodeChanged() {
        this.getData();
    }

    correspondingIssuerChanged() {
        this.getData();
    }

    correspondingCodeChanged() {
        this.getData();
    }

    async getData() {
        const rawData = await this.tickerResource.list(this.start, this.end);
        this.data = rawData.map(this.convertTicker.bind(this));

        //vm.stellarServer.orderbook().trades().stream({
        //    onmessage: message => {
        //        if (vm.processDataTimeout) {
        //            window.clearTimeout(vm.processDataTimeout);
        //        }
//
        //        vm.rawData.push(message);
        //        vm.processDataTimeout = window.setTimeout(vm.processData.bind(vm), 350);
        //    },
        //    onerror: () => {
        //        vm.error = true;
        //    }
        //});
    }

    convertTicker(rawTicker) {

    }

    processData() {
        this.data =
    }

    draw() {
        data = data.slice(0, 200).map(function(d) {
            return {
                date: parseDate(d.Date),
                open: +d.Open,
                high: +d.High,
                low: +d.Low,
                close: +d.Close,
                volume: +d.Volume
            };
        }).sort(function(a, b) { return d3.ascending(this.accessor.d(a), this.accessor.d(b)); });

        this.x.domain(this.data.map(this.candlestick.accessor().d));
        this.y.domain(techan.scale.plot.ohlc(this.data, this.candlestick.accessor()).domain());

        this.svg.selectAll("g.candlestick").datum(this.data).call(this.candlestick);
        this.svg.selectAll("g.x.axis").call(this.xAxis);
        this.svg.selectAll("g.y.axis").call(this.yAxis);
    }
}
