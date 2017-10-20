
import BigNumber from 'bignumber.js';

const defaultOptions = {
    rm: BigNumber.ROUND_DOWN
};

/**
 * Produces a valid stellar number from a number
 * @param num - The number to be processed
 * @param [options]
 * @param [options.rm] - The rounding mode to use in toFixed(7)
 * @returns {string}
 */
export function validStellarNumber(original, options = {}) {
    let result = original;
    
    if (!result) {
        return result;
    }
    
    const _options = {
        ...defaultOptions,
        ...options
    };
    const max = "922337203685.4775807";

    result = (new BigNumber(result)).abs();

    result = result.greaterThan(max) ?
        new BigNumber(max) :
        result;

    if (result.dp() >= 7) {
        return result.toFixed(7, options.rm);
    }

    //result.valueOf will result in losing trailing zeros. Just return the original instead of no modifications were made.
    if (typeof original === 'string' && result.equals(original)) {
        return original;
    }

    return result.valueOf();
}
