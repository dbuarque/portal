
import BigNumber from 'bignumber.js';

const defaultOptions = {
    rm: BigNumber.ROUND_DOWN
};

/**
 * Produces a valid stellar number from a number
 * @param original - The number to be processed
 * @param [options]
 * @param [options.rm] - The rounding mode to use in toFixed(7)
 * @returns {string}
 */
export function validStellarNumber(original, options = {}) {
    let result = original;
    
    if (!result) {
        return result;
    }

    if (result === '.') {
        return '0.';
    }

    const _options = {
        ...defaultOptions,
        ...options
    };
    const max = "922337203685.4775807";
    const stringForm = result instanceof BigNumber ? result.valueOf() : result.toString();

    // Get rid of all non digits or decimals.
    result = stringForm.replace(/[^\d.]/g, '');

    // Get rid of all but first decimal
    const resultArr = result.split('.');
    result = resultArr.length >= 2 ? resultArr[0] + '.' + resultArr[1] : resultArr[0];

    result = (new BigNumber(result));

    // If greater than maximum, replace with maximum
    result = result.greaterThan(max) ?
        new BigNumber(max) :
        result;

    // Truncate to a maximum of 7 decimal places if number has more than that.
    if (result.dp() > 7) {
        result = result.toFixed(7, options.rm);
    }
    //result.valueOf will result in losing trailing zeros. Just return the original instead if no modifications were made.
    else if (typeof original === 'string' && result.equals(original)) {
        result = original;
    }
    else {
        result = result.valueOf();
    }

    return ensureZeroInFrontOfDecimal(
        result
    );
}

function ensureZeroInFrontOfDecimal(numString) {
    if (numString.charAt(0) === '.') {
        numString = '0.' + numString.slice(1);
    }

    return numString;
}
