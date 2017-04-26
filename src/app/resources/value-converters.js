/**
 * Created by Ishai on 4/26/2017.
 */

export class FormatNumberValueConverter {
    toView(num, sigFigs = 5) {
        if (num < 1) {
            return num.toPrecision(sigFigs);
        }
        return d3.format(',.' + sigFigs + 's')(num).replace('k', 'K').replace('G', 'B');
    }
}