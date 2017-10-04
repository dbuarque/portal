
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
export function validStellarNumber(num, options = {}) {
    const _options = {
        ...defaultOptions,
        ...options
    };

    return (new BigNumber(num)).abs()
        // stellar numbers cannot have more than 7 decimal places.
        .toFixed(7, options.rm)
        // replace zeros trailing a decimal
        .replace(/\.?0+$/, '')
        .slice(0, 15);
}
