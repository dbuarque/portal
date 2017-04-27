/**
 * Created by istrauss on 3/19/2017.
 */

import _throttle from 'lodash/throttle';
import _find from 'lodash/find';
import {inject} from 'aurelia-framework';
import techan from 'techan';
import {StellarServer, AppStore, ObserverManager, ObservationInstruction} from 'global-resources';
import {TickerResource, FormatNumberValueConverter} from 'app-resources';

@inject(Element, StellarServer, AppStore, ObserverManager, TickerResource, FormatNumberValueConverter)
export class PriceChartCustomElement {

    loading = 0;
    numRefreshes = 0;
    interval = "86400";
    noData = false;

    constructor(element, stellarServer, appStore, observerManager, tickerResource, formatNumber) {
        this.element = element;
        this.stellarServer = stellarServer;
        this.appStore = appStore;
        this.observerManager = observerManager;
        this.tickerResource = tickerResource;
        this.formatNumber = formatNumber;

        this.move = _throttle(this._move.bind(this), 100);
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

        const margin = {top: 50, right: 100, bottom: 30, left: 100};
        this.width = Math.max(this.$element.find('.price-chart').width() - margin.left - margin.right - 30, 900);
        this.height = this.width * 0.5 - margin.top - margin.bottom - 30;

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

        this.xTopAxis = d3.axisTop(this.x);

        this.yAxis = d3.axisLeft(this.y)
            .tickFormat(num => this.formatNumber(num, 3));
//
        this.volumeAxis = d3.axisRight(this.yVolume)
            .tickFormat(num => this.formatNumber(num, 3));

        this.ohlcAnnotation = techan.plot.axisannotation()
            .axis(this.yAxis)
            .orient('left')
            .width(40)
            .format(num => this.formatNumber(num));
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
            .format(num => this.formatNumber(num))
            .width(40)
            .translate([this.width, 0]);

        this.crosshair = techan.plot.crosshair()
            .xScale(this.x)
            .yScale(this.y)
            .xAnnotation([this.timeAnnotation, this.timeTopAnnotation])
            .yAnnotation([this.ohlcAnnotation, this.volumeAnnotation])
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

        const fullData = this.getFullData(rawData, lastPreviousDatum, start, end);
        this.data = this.draw(fullData);

        this.loading--;
    }

    getFullData(rawData, lastPreviousRawDatum, start, end) {
        start = new Date(start || rawData[0].begin_ts);
        end = end ? new Date(end) : new Date();

        const data = [];
        let lastPreviousDatum;

        if (lastPreviousRawDatum) {
            lastPreviousDatum = this.lastPreviousDatum(lastPreviousRawDatum);
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
            volume: 0,
            buyingVolume: 0,
            sellingVolume: 0
        };
    }
    
    mapDatumForGraph(rawDatum) {
        return {
            date: new Date(rawDatum.begin_ts),
            open: rawDatum.open,
            high: rawDatum.high,
            low: rawDatum.low,
            close: rawDatum.close,
            volume: rawDatum.sold_vol,
            buyingVolume: rawDatum.sold_vol,
            sellingVolume: rawDatum.sold_vol
        };
    }

    draw(data) {
        const self = this;

        self.svg.selectAll('*').remove();
        
        data = data
            .sort((a, b) => {
                return d3.ascending(self.accessor.d(a), self.accessor.d(b));
            });

        const xDomain = data.map(self.accessor.d);
        const yDomain = this.ensureNoEmptyDomain(techan.scale.plot.ohlc(data, self.accessor).domain());
        const yVolumeDomain = this.ensureNoEmptyDomain(techan.scale.plot.volume(data).domain());
        //const ySellingVolumeDomain = this.ensureNoEmptyDomain(techan.scale.plot.volume(data.map(d => {
        //    return {
        //        ...d,
        //        volume: d.sellingVolume
        //    };
        //})).domain());

        //expand yDomains to make room for currentData table in top right
        yDomain[1] = yDomain[1] * (1 + 50/self.height);
        yVolumeDomain[1] = yVolumeDomain[1] * (1 + 50/self.height);

        self.x.domain(xDomain);
        self.y.domain(yDomain);
        self.yVolume.domain(yVolumeDomain);
        //self.ySellingVolume.domain(ySellingVolumeDomain);

        self.svg.append('text')
            .attr("x",self.height * 0.45)
            .attr("y", 45)
            .attr("transform", "rotate(90)")
            .text("Price (" + this.assetPair.buying.code + '/' + this.assetPair.selling.code + ")");

        //.svg.append('text')
        //    .attr("x",self.height * 0.45)
        //    .attr("y", -45)
        //    .attr("transform", "rotate(90)")
        //    .text("Volume (" + self.assetPair.buying.code + ")");

        //self.svg.append('text')
        //    .attr("x", self.width + self.height * 0.45)
        //    .attr("y", 50)
        //    .attr('transform', 'rotate(90,' + self.width + ',' + 0 + ')')
        //    .text("Volume (" + self.assetPair.selling.code + ")");

        self.svg.append('text')
            .attr("x", self.width + self.height * 0.45)
            .attr("y", -40)
            .attr('transform', 'rotate(90,' + self.width + ',' + 0 + ')')
            .text("Volume (" + self.assetPair.selling.code + ")");

        //self.coordsText = self.svg.append('text')
        //    .style("text-anchor", "end")
        //    .attr("class", "coords")
        //    .attr("x", self.width - 5)
        //    .attr("y", 15);

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

        //self.svg.append("g")
        //    .attr("class", "y axis")
        //    .attr("transform", "translate(" + self.width + ",0)")
        //    .call(self.yRightAxis);

        self.svg.append("g")
            .attr("class", "volume")
            .attr("clip-path", "url(#ohlcClip)");

        self.svg.append("g")
            .attr("class", "volume axis")
            .attr("transform", "translate(" + self.width + ",0)")
            .call(self.volumeAxis);

        //self.svg.append("g")
        //    .attr("class", "volume axis")
        //    .attr("transform", "translate(" + self.width + ",0)")
        //    .call(self.volumeRightAxis);

        self.svg.append('g')
            .attr("class", "crosshair")
            .call(self.crosshair); // Display the current data

        self.svg.select("g.volume")
            .datum(data)
            .call(self.volume);

        self.svg.select("g.volume").call(self.volume.refresh);

        //self.svg.selectAll("g.candlestick").datum(data).call(self.candlestick);
        //self.svg.selectAll("g.x.axis").call(self.xAxis);
        //self.svg.selectAll("g.y.axis").call(self.yAxis);

        return data;
    }

    addSeconds(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }

    ensureNoEmptyDomain(domainArr) {
        if (domainArr.length === 0) {
            return domainArr;
        }

        for(let i = 0; i < domainArr.length; i++) {
            if (i - 1 > -1 && domainArr[i] !== domainArr[i - 1]) {
                return domainArr;
            }
        }

        return domainArr[0] === 0 ?
            [0, 1] :
            [domainArr[0] * 0.5, domainArr[0] * 1.5];
    }

    enter() {
        this.currentData = undefined;
    }

    out() {
        this.currentData = undefined;
    }

    _move(coords) {
        const currentData = _find(this.data, {date: coords.x});
        this.currentData = currentData ? Object.keys(currentData).reduce((_currentData, key) => {
            if (key !== 'date') {
                _currentData[key] = this.formatNumber.toView(currentData[key]);
            }
            return _currentData;
        }, {}) : undefined;
    }
}
