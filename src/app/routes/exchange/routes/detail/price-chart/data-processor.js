/**
 * Created by istrauss on 5/23/2017.
 */

import moment from 'moment';

export class DataProcessor {

    fillInData(rawData, options) {
        let {lastPreviousDatum, start, end, interval} = options;

        start = moment(start || rawData[0].begin_ts);
        end = moment(end);

        const data = [];

        if (lastPreviousDatum) {
            lastPreviousDatum = this.lastPreviousDatum(lastPreviousDatum);
        }

        let i = 0;
        let d = this.calculateFirstDate(start, interval);
        while(d.isSameOrBefore(end)) {
            if (i < rawData.length && d.isSameOrAfter(moment(rawData[i].begin_ts))) {
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
            d = d.add(parseInt(interval, 10), 'seconds');
        }

        return data;
    }

    calculateFirstDate(start, interval) {
        let d = moment(start).startOf('day');
        while(d.isSameOrBefore(start)) {
            d = d.add(parseInt(interval, 10), 'seconds');
        }

        return d;
    }

    mapDatumForGraph(rawDatum) {
        return {
            date: new Date(rawDatum.begin_ts),
            open: rawDatum.open,
            high: rawDatum.high,
            low: rawDatum.low,
            close: rawDatum.close,
            volume: rawDatum.sold_vol,
            buyingVolume: rawDatum.bought_vol,
            sellingVolume: rawDatum.sold_vol
        };
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
}
