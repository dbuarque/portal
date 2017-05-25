/**
 * Created by istrauss on 5/23/2017.
 */

import {inject, TaskQueue} from 'aurelia-framework';
import techan from 'techan';
import {AppStore} from 'global-resources';
import {TickerResource} from 'app-resources';
import {DataProcessor} from '../data-processor';

@inject(Element, TaskQueue, AppStore, TickerResource, DataProcessor)
export class BrushChartCustomElement {

    loading = 0;

    constructor(element, taskQueue, appStore, tickerResource, dataProcessor) {
        this.element = element;
        this. taskQueue= taskQueue;
        this.appStore = appStore;
        this.tickerResource = tickerResource;
        this.dataProcessor = dataProcessor;
    }

    attached() {
        //Not sure why it doesn't render correctly without this queue
        this.taskQueue.queueTask(() => {
            this.$element = $(this.element);
            this.$chart = this.$element.find('.chart');

            this.margin = {top: 0, right: 0, bottom: 20, left: 0};
            const chartWidth = this.$element.parent().width();
            this.width = Math.max(this.$element.parent().width() - this.margin.left - this.margin.right, 900 - this.margin.left - this.margin.right);
            this.height = 50;

            this.brush = d3.brushX()
                .extent([[0, 0], [this.width, this.height]])
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
                .attr("width", this.width + this.margin.left + this.margin.right - 8)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .attr("transform", "translate(3,0)");

            this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
            this.updateFromStore();
        });
    }

    unbind() {
        this.unsubscribeFromStore();
    }

    updateFromStore() {
        const newState = this.appStore.getState();
        const exchange = newState.exchange;
        const priceChart = exchange.detail.priceChart;

        if (this.assetPair !== exchange.assetPair) {
            this.assetPair = exchange.assetPair;
            this.refresh();
        }

        this.interval = priceChart.interval;
        this.start = priceChart.start;
        this.end = priceChart.end;
    }

    async refresh() {
        this.loading++;

        const rawData = await this.tickerResource.closeHistory(this.assetPair);
        //const rawData = await this.tickerResource.list(86400, this.assetPair);

        this.data = this.dataProcessor.fillInData(rawData, {
            interval: 86400
        });

        this.svg.selectAll('*').remove();

        this.xDomain = this.data.map(d => d.date);
        const yDomain = rawData.reduce(
            (domain, d) => {
                domain[0] = domain[0] < d.close ? domain[0] : d.close;
                domain[1] = domain[1] > d.close ? domain[1] : d.close;
                return domain;
                //return {
                //    0: domain[0] < d.close ? domain[0] : d.close,
                //    1: domain[1] > d.close ? domain[1] : d.close
                //};
            },
            [
                this.data[0].close,
                this.data[0].close
            ]
        );

        yDomain[0] = yDomain[0] - 0.1 * yDomain[0];
        yDomain[1] = yDomain[1] * 1.1;

        this.x.domain(this.xDomain);
        this.y.domain(yDomain);

        this.context = this.svg.append("g")
            .attr("class", "context");

        this.context.append("g")
            .attr("class", "close");

        const xAxisSvg = this.context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (this.height + 1) + ")")
            .call(this.xAxis);

        xAxisSvg.append("path")
            .attr("class", "axis-line")
            .attr("d", "M -5,0 V -0.5 H " + (this.margin.left + this.width + this.margin.right) + " V 0");

        this.context.select("g.close").datum(this.data).call(this.close);

        this.context
            .call(this.brush)
            .selectAll("rect")
            .attr("height", this.height);

        this.adjustBrush();

        this.loading--;
    }

    brushed() {
        //if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        //var s = d3.event.selection || x2.range();
        //x.domain(s.map(x2.invert, x2));
        //focus.select(".area").attr("d", area);
        //focus.select(".axis--x").call(xAxis);
        //svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        //    .scale(width / (s[1] - s[0]))
        //    .translate(-s[0], 0));
    }

    adjustBrush() {
        const brushDomain = this.xDomain.filter(x => {
            return !(this.start && moment(x).isBefore(moment(this.start))) &&
                    !(this.end && moment(x).isAfter(moment(this.end)));
        });

        this.context.call(this.brush.move, brushDomain);
    }
}
