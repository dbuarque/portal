/**
 * Created by istrauss on 3/19/2017.
 */

import {inject} from 'aurelia-framework';
import techan from 'techan';
import {StellarServer, AppStore, ObserverManager, ObservationInstruction} from 'resources';
import {TickerResource} from 'app-resources';

@inject(Element, StellarServer, AppStore, ObserverManager, TickerResource)
export class PriceChartCustomElement {

    loading = 0;
    interval = "86400";
    noData = false;

    constructor(element, stellarServer, appStore, observerManager, tickerResource) {
        this.element = element;
        this.stellarServer = stellarServer;
        this.appStore = appStore;
        this.observerManager = observerManager;
        this.tickerResource = tickerResource;
    }

    bind() {
        this.unsubscribeFromStore = this.appStore.subscribe(this.updateFromStore.bind(this));
        this.updateFromStore();
        this.subscribeObservers();
    }

    unbind() {
        this.unsubscribeFromStore();
        this.observerManager.unsubscribe();
    }

    attached() {
        this.$element = $(this.element);
        this.$chart = this.$element.find('.chart');


        const margin = {top: 50, right: 40, bottom: 30, left: 40};
        this.width = this.$element.find('.price-chart').width() - margin.left - margin.right - 30;
        this.height = this.width * 0.5 - margin.top - margin.bottom - 30;

        this.x = techan.scale.financetime()
            .range([0, this.width]);

        this.y = d3.scaleLinear()
            .range([this.height, 0]);

        this.candlestick = techan.plot.candlestick()
            .xScale(this.x)
            .yScale(this.y);

        this.yVolume = d3.scaleLinear()
            .range([this.y(0.01), this.y(0.26)]);

        this.volume = techan.plot.volume()
            .accessor(this.candlestick.accessor())   // Set the accessor to a ohlc accessor so we get highlighted bars
            .xScale(this.x)
            .yScale(this.yVolume);

        this.xAxis = d3.axisBottom(this.x);

        this.xTopAxis = d3.axisTop(this.x);

        this.yAxis = d3.axisLeft(this.y);

        this.yRightAxis = d3.axisRight(this.y);

        this.volumeAxis = d3.axisRight(this.yVolume)
            .ticks(3)
            .tickFormat(d3.format(",.3s"));

        this.ohlcAnnotation = techan.plot.axisannotation()
            .axis(this.yAxis)
            .orient('left')
            .format(d3.format(',.2f'));

        this.ohlcRightAnnotation = techan.plot.axisannotation()
            .axis(this.yRightAxis)
            .orient('right')
            .translate([this.width, 0]);

        this.timeAnnotation = techan.plot.axisannotation()
            .axis(this.xAxis)
            .orient('bottom')
            .format(d3.timeFormat('%Y-%m-%d'))
            .width(65)
            .translate([0, this.height]);

        this.timeTopAnnotation = techan.plot.axisannotation()
            .axis(this.xTopAxis)
            .orient('top');

        this.volumeAnnotation = techan.plot.axisannotation()
            .axis(this.volumeAxis)
            .orient("right")
            .width(35);

        this.crosshair = techan.plot.crosshair()
            .xScale(this.x)
            .yScale(this.y)
            .xAnnotation([this.timeAnnotation, this.timeTopAnnotation])
            .yAnnotation([this.ohlcAnnotation, this.ohlcRightAnnotation, this.volumeAnnotation])
            .on("enter", this.enter.bind(this))
            .on("out", this.out.bind(this))
            .on("move", this.move.bind(this));

        this.svg = d3.select(this.$chart[0]).append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.accessor = this.candlestick.accessor();
    }

    subscribeObservers() {
        const instructions = [
            new ObservationInstruction(this, 'start', this.refresh.bind(this)),
            new ObservationInstruction(this, 'end', this.refresh.bind(this))
        ];

        this.observerManager.subscribe(instructions);
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
        if (!this.assetPair) {
            return;
        }

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

        const rawData = values[0];

        this.noData = rawData.length === 0;
        if (this.noData) {
            return;
        }

        const lastPreviousDatum = values[1][0];
        let start = this.start;
        let end = this.end;

        if (start && !lastPreviousDatum) {
            start = new Date(rawData[0].begin_ts);
        }

        const fullData = this.getFullData(rawData, lastPreviousDatum, start, end);
        this.draw(fullData);

        this.loading--;
    }

    getFullData(rawData, lastPreviousDatum, start, end) {
        start = new Date(start || rawData[0].begin_ts);
        end = end ? new Date(end) : new Date();
        const data = [];

        if (lastPreviousDatum) {
            lastPreviousDatum = this.lastPreviousDatum(lastPreviousDatum);
        }

        let i = 0;
        let d = start;
        while(moment(d).isSameOrBefore(end)) {
            if (i < rawData.length && moment(d).isSameOrAfter(rawData[i].begin_ts)) {
                data.push(this.mapDatumForGraph(rawData[i]));
                lastPreviousDatum = this.lastPreviousDatum(rawData[i]);
                i++;
            }
            else {
                data.push({
                    ...lastPreviousDatum,
                    date: new Date(d.valueOf())
                })
            }
            d = this.addSeconds(d, parseInt(this.interval, 10));
        }

        return data;
    }

    lastPreviousDatum(rawDatum) {
        return {
            open: rawDatum.close,
            high: rawDatum.close,
            low: rawDatum.close,
            close: rawDatum.close,
            volume: 0
        };
    }
    
    mapDatumForGraph(rawDatum) {
        return {
            date: new Date(rawDatum.begin_ts),
            open: rawDatum.open,
            high: rawDatum.high,
            low: rawDatum.low,
            close: rawDatum.close,
            volume: rawDatum.bought_vol
        };
    }

    draw(data) {
        const self = this;
        
        data = data
            .sort((a, b) => {
                return d3.ascending(self.accessor.d(a), self.accessor.d(b));
            });

        self.svg.selectAll('*').remove();

        self.coordsText = self.svg.append('text')
            .style("text-anchor", "end")
            .attr("class", "coords")
            .attr("x", self.width - 5)
            .attr("y", 15);

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

        self.x.domain(data.map(self.accessor.d));
        self.y.domain(techan.scale.plot.ohlc(data, self.accessor).domain());

        self.svg.append("g")
            .datum(data)
            .attr("class", "candlestick")
            .call(self.candlestick);

        self.svg.append("g")
            .attr("class", "x axis")
            .call(self.xTopAxis);

        self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + self.height + ")")
            .call(self.xAxis);

        self.svg.append("g")
            .attr("class", "y axis")
            .call(self.yAxis);

        self.svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + self.width + ",0)")
            .call(self.yRightAxis);

        self.svg.append("g")
            .attr("class", "volume")
            .attr("clip-path", "url(#ohlcClip)");

        self.svg.append("g")
            .attr("class", "volume axis");

        self.svg.append('g')
            .attr("class", "crosshair")
            .call(self.crosshair); // Display the current data

        self.yVolume.domain(techan.scale.plot.volume(data).domain());

        self.svg.select("g.volume")
            .datum(data)
            .call(self.volume);

        self.svg.select("g.volume.axis")
            .call(self.volumeAxis);

        self.svg.append('text')
            .attr("x", self.height * 0.3)
            .attr("y", -10)
            .attr("transform", "rotate(90)")
            .text("Price (" + this.assetPair.buying.code + '/' + this.assetPair.selling.code + ")");

        self.svg.append('text')
            .attr("x", self.height * 0.8)
            .attr("y", -50)
            .attr("transform", "rotate(90)")
            .text("Volume (" + self.assetPair.buying.code + ")");

        self.svg.select("g.volume").call(self.volume.refresh);

        //self.svg.selectAll("g.candlestick").datum(data).call(self.candlestick);
        //self.svg.selectAll("g.x.axis").call(self.xAxis);
        //self.svg.selectAll("g.y.axis").call(self.yAxis);
    }

    addSeconds(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }

    enter() {
        this.coordsText.style("display", "inline");
    }

    out() {
        this.coordsText.style("display", "none");
    }

    move(coords) {
        this.coordsText.text(
            this.timeAnnotation.format()(coords.x) + ", " + this.ohlcAnnotation.format()(coords.y)
        );
    }
}
