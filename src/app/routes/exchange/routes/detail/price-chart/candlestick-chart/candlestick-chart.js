/**
 * Created by istrauss on 3/19/2017.
 */

import _throttle from 'lodash.throttle';
import _find from 'lodash.find';
import {inject} from 'aurelia-framework';
import techan from 'techan';
import {StellarServer, AppStore, ObservationInstruction} from 'global-resources';
import {TickerResource, FormatNumberValueConverter} from 'app-resources';
import {DataProcessor} from '../data-processor';

@inject(Element, StellarServer, AppStore, TickerResource, FormatNumberValueConverter, DataProcessor)
export class CandlestickChartCustomElement {

    loading = 0;
    numRefreshes = 0;
    noData = false;
    numTicks = 8;

    formatMillisecond = d3.timeFormat(".%L");
    formatSecond = d3.timeFormat("%M:%S");
    formatMinute = d3.timeFormat("%I:%M");
    formatHour = d3.timeFormat("%I %p");
    formatDay = d3.timeFormat("%a %d");
    formatWeek = d3.timeFormat("%b %d");
    formatMonth = d3.timeFormat("%B");
    formatYear = d3.timeFormat("%Y");

    constructor(element, stellarServer, appStore, tickerResource, formatNumber, dataProcessor) {
        this.element = element;
        this.stellarServer = stellarServer;
        this.appStore = appStore;
        this.tickerResource = tickerResource;
        this.formatNumber = formatNumber;
        this.dataProcessor = dataProcessor;

        this.move = _throttle(this._move.bind(this), 100);
        this.refresh = _throttle(this._refresh.bind(this), 250);
    }

    attached() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));

        this.$element = $(this.element);
        this.$chart = this.$element.find('.chart');

        this.margin = {top: 0, right: 100, bottom: 20, left: 100};
        this.width = this.$element.parent().width() - this.margin.left - this.margin.right;
        this.height = 300 - 21;

        this.x = techan.scale.financetime()
            .range([0, this.width]);

        this.y = d3.scaleLinear()
            .range([this.height, 0]);

        this.candlestick = techan.plot.candlestick()
            .xScale(this.x)
            .yScale(this.y)
            .width((x) => {
                const barWidth = x.band() * 0.7;
                return Math.max(barWidth.toFixed(0), 1);
            });

        this.yVolume = d3.scaleLinear()
            .range([this.height, 0]);

        //this.ySellingVolume = d3.scaleLinear()
        //    .range([this.height, 0]);

        this.volume = techan.plot.volume()
            .accessor(this.candlestick.accessor())   // Set the accessor to a ohlc accessor so we get highlighted bars
            .xScale(this.x)
            .yScale(this.yVolume);

        this.xAxis = d3.axisBottom(this.x);

        this.defaultXAxisTickFormat = this.xAxis.tickFormat();
        this.defaultXAxisTicks = this.xAxis.ticks();
            //.tickFormat(this._multiFormat.bind(this));

        this.yAxis = d3.axisLeft(this.y)
            .tickFormat(num => this.formatNumber.toView(num, 3));

        this.volumeAxis = d3.axisRight(this.yVolume)
            .tickFormat(num => this.formatNumber.toView(num, 3));

        this.ohlcAnnotation = techan.plot.axisannotation()
            .axis(this.yAxis)
            .orient('left')
            .width(90)
            .format(num => this.formatNumber.toView(num));

        this.timeAnnotation = techan.plot.axisannotation()
            .axis(this.xAxis)
            .orient('bottom')
            .format(d3.timeFormat('%Y-%m-%d %H:%M %p'))
            .width(130)
            .translate([0, this.height]);

        this.volumeAnnotation = techan.plot.axisannotation()
            .axis(this.volumeAxis)
            .orient("right")
            .format(num => this.formatNumber.toView(num))
            .width(90)
            .translate([this.width, 0]);

        this.crosshair = techan.plot.crosshair()
            .xScale(this.x)
            .yScale(this.y)
            .xAnnotation([this.timeAnnotation])
            .yAnnotation([this.ohlcAnnotation, this.volumeAnnotation])
            .on("enter", this.enter.bind(this))
            .on("out", this.out.bind(this))
            .on("move", this.move.bind(this));

        this.svg = d3.select(this.$chart[0]).append("svg")
            .attr("class", "main-chart")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.accessor = this.candlestick.accessor();

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
        const priceChart = exchange.detail.priceChart;

        if (this.assetPair !== exchange.assetPair ||
            this.start !== priceChart.start ||
            this.end !== priceChart.end ||
            this.interval !== priceChart.interval
        ) {
            this.assetPair = exchange.assetPair;
            this.start = priceChart.start;
            this.end = priceChart.end;
            this.interval = priceChart.interval;
            this.refresh();
        }
    }

    async _refresh() {
        if (!this.assetPair) {
            return;
        }

        this.numRefreshes++;
        const refreshNum = this.numRefreshes;

        this.loading++;

        const values = await Promise.all([
            //this.tickerResource.list(this.interval, {
            //    buying: {
            //        code: 'XLM'
            //    },
            //    selling: {
            //        code: 'JPY',
            //        issuer: 'GBVAOIACNSB7OVUXJYC5UE2D4YK2F7A24T7EE5YOMN4CE6GCHUTOUQXM'
            //    }
            //}, this.start, this.end),
            this.tickerResource.list(this.interval, this.assetPair, this.start, this.end),
            this.start ? this.tickerResource.lastPrevious(this.interval, this.assetPair, this.start) : Promise.resolve([])
        ]);

        if (refreshNum !== this.numRefreshes) {
            this.loading--;
            return;
        }

        const rawData = values[0];
        const lastPreviousDatum = values[1][0];

        this.noData = rawData.length === 0 && !lastPreviousDatum;
        if (this.noData) {
            this.loading--;
            return;
        }

        let start = this.start;
        let end = this.end;

        if (start && !lastPreviousDatum) {
            start = new Date(rawData[0].begin_ts);
        }

        const fullData = this.dataProcessor.fillInData(rawData, {
            lastPreviousDatum,
            start,
            end,
            interval: this.interval
        });

        this.data = this.draw(fullData);

        this.loading--;
    }

    draw(data) {
        const self = this;

        self.svg.selectAll('*').remove();
        
        data = data
            .sort((a, b) => {
                return d3.ascending(self.accessor.d(a), self.accessor.d(b));
            });

        const xDomain = data.map(self.accessor.d);
        const yDomain = this.normalizeDomain(techan.scale.plot.ohlc(data, self.accessor).domain());
        const yVolumeDomain = this.normalizeDomain(techan.scale.plot.volume(data).domain());

        //expand yDomains to make room for currentData table in top right
        yDomain[1] = yDomain[1] * (1 + 50/self.height);
        yVolumeDomain[1] = yVolumeDomain[1] * (1 + 50/self.height);

        yDomain[0] = yDomain[0] > 0 ? 0 : yDomain[0];
        yVolumeDomain[0] = yVolumeDomain[0] > 0 ? 0 : yVolumeDomain[0];

        self.x.domain(xDomain);
        self.y.domain(yDomain);
        self.yVolume.domain(yVolumeDomain);

        const domainHours = moment.duration(moment(data[data.length - 1].date).diff(moment(data[0].date))).asHours();

        if (domainHours < 24 * 4 && domainHours > 23) {
            self.xAxis
                .ticks(
                    d3.timeHour,
                    domainHours / 10
                )
                .tickFormat(d3.timeFormat('%m/%d-%H:%M'))
        }
        else if (domainHours < 24) {
            self.xAxis
                .ticks(
                    d3.timeMinute,
                    domainHours * 60 / 10
                )
                .tickFormat(d3.timeFormat('%H:%M'))
        }
        else {
            self.xAxis.ticks()
                .tickFormat(this.x.tickFormat());
        }
        //self.xAxis
        //    .ticks(
        //        d3.timeHour,
        //        this.numTicks
        //    );
        //self.xAxis
        //    .ticks(this._tickInterval(data), this.numTicks);


        //Calculate how far away the y axis labels need to be.
        const yDomainWidth = this.calculateAxisWidth(yDomain);
        const yVolumeDomainWidth = this.calculateAxisWidth(yVolumeDomain);

        self.svg.append('text')
            .attr("x",self.height * 0.45)
            .attr("y", 20 + yDomainWidth * 7)
            .attr("transform", "rotate(90)")
            .text("Price (" + this.assetPair.buying.code + '/' + this.assetPair.selling.code + ")");

        self.svg.append('text')
            .attr("x", self.width + self.height * 0.45)
            .attr("y", -(20 + yVolumeDomainWidth * 7))
            .attr('transform', 'rotate(90,' + self.width + ',' + 0 + ')')
            .text("Volume (" + self.assetPair.selling.code + ")");

        self.svg.append("g")
            .attr("class", "candlestick");

        self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + self.height + ")");

        self.svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");

        self.svg.append("g")
            .datum(data)
            .attr("class", "candlestick")
            .call(self.candlestick);

        const xAxisSvg = self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + self.height + ")")
            .call(self.xAxis);

        xAxisSvg.append("path")
            .attr("class", "axis-line")
            .attr("d", "M -" + self.margin.left + ",0 V -0.5 H " + (self.width + self.margin.right) + " V 0");

        const yAxisSvg = self.svg.append("g")
            .attr("class", "y axis")
            .call(self.yAxis);

        yAxisSvg.append("path")
            .attr("class", "axis-line")
            .attr("d", "M 0," + (self.height + self.margin.bottom + 5) + " H -0.5 V -0.5 H 0");

        self.svg.append("g")
            .attr("class", "volume")
            .attr("clip-path", "url(#ohlcClip)");

        const volumeAxisSvg = self.svg.append("g")
            .attr("class", "volume axis")
            .attr("transform", "translate(" + self.width + ",0)")
            .call(self.volumeAxis);

        volumeAxisSvg.append("path")
            .attr("class", "axis-line")
            .attr("d", "M 0," + (self.height + self.margin.bottom + 5) + " H -0.5 V -0.5 H 0");

        self.svg.append('g')
            .attr("class", "crosshair")
            .call(self.crosshair); // Display the current data

        self.svg.select("g.volume")
            .datum(data)
            .call(self.volume);

        self.svg.select("g.volume").call(self.volume.refresh);

        this.removeZeroTickers(yAxisSvg);
        this.removeZeroTickers(volumeAxisSvg);

        return data;
    }

    normalizeDomain(domainArr) {
        if (domainArr.length === 0) {
            return domainArr;
        }

        //Make sure that there is more than one number in the domain
        for(let i = 0; i < domainArr.length; i++) {
            if (i - 1 > -1 && domainArr[i] !== domainArr[i - 1]) {
                return domainArr;
            }
        }

        //If there is only one number in the domain,
        return domainArr[0] === 0 ?
            [0, 1] :
            [domainArr[0] * 0.5, domainArr[0] * 1.5];
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

    _formatTicks(data) {

    }

    _tickInterval(data) {
        const seconds = moment.duration(moment(data[data.length - 1].date).diff(moment(data[0].date))).asSeconds() / this.numTicks;
        const secondsInterval = d3.timeSecond.every(seconds);

        return new d3.timeInterval(
            date => {
                return
            },
            secondsInterval.offset.bind(secondsInterval),
            (start, end) => {
                start = moment(start);
                start = start.seconds(start.seconds() + 1);
                end = moment(end);

                let num = moment.duration(end.diff(start)).asSeconds() / seconds;

                return num.toFixed(0);
            }
        );
    }

    _multiFormat(date) {
        return (d3.timeSecond(date) < date ? this.formatMillisecond
            : d3.timeMinute(date) < date ? this.formatSecond
            : d3.timeHour(date) < date ? this.formatMinute
            : d3.timeDay(date) < date ? this.formatHour
            : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? this.formatDay : this.formatWeek)
            : d3.timeYear(date) < date ? this.formatMonth
            : this.formatYear)(date);
    }

    _move(coords) {
        const currentData = _find(this.data, {date: coords.x});
        this.currentData = currentData ? Object.keys(currentData).reduce((_currentData, key) => {
            _currentData[key] = key !== 'date' ? this.formatNumber.toView(currentData[key]) : currentData[key];
            return _currentData;
        }, {}) : undefined;
    }
}
