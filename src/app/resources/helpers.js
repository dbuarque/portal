/**
 * Created by Ishai on 9/24/2017.
 */

import BigNumber from 'bignumber.js';

export function validStellarNumber(num) {
    return (new BigNumber(num)).abs().toFixed(7).replace(/\.?0+$/, '').slice(0, 15);
}
