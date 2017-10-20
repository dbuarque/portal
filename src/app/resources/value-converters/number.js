/**
 * Created by istrauss on 9/25/2017.
 */

import BigNumber from 'bignumber.js';
import {validStellarNumber} from '../helpers';

export class DivideByValueConverter {
    toView(n, d) {
        return (new BigNumber(n)).dividedBy(d);
    }
}

export class MultiplyByValueConverter {
    toView(n1, n2) {
        return (new BigNumber(n1)).times(n2)
    }
}

export class ToPrecisionValueConverter {
    toView(num, precision) {
        let result = parseFloat(num, 10).toPrecision(precision);
        const resultSplit = result.split('.');
        if (resultSplit.length > 1 && resultSplit[1].length > 7) {
            result = parseFloat(result).toFixed(7);
        }

        return result;
    }
}

export class ValidStellarNumberValueConverter {
    toView(num) {
        return num ? validStellarNumber(num) : num;
    }
}

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

