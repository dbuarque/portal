/**
 * Created by Ishai on 4/26/2017.
 */

export class FormatNumberValueConverter {
    toView(num, sigFigs = 8) {
        sigFigs = parseInt(sigFigs);

        //Make sure sigFigs meets requirements of toPrecision()
        if (isNaN(sigFigs) || sigFigs < 1 || sigFigs > 21) {
            sigFigs = 8;
        }

        if (num < 1) {
            return num.toPrecision(sigFigs);
        }
        return d3.format(',.' + sigFigs + 's')(num).replace('k', 'K').replace('G', 'B');
    }
}
