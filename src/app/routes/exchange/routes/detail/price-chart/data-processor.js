/**
 * Created by istrauss on 5/23/2017.
 */

export class DataProcessor {

    fillInData(rawData, options) {
        let {lastPreviousRawDatum, start, end, interval} = options;

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
            d = this.addSeconds(d, parseInt(interval, 10));
        }

        return data;
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

    addSeconds(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }
}
