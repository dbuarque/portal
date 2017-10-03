/**
 * Created by istrauss on 9/25/2017.
 */

export function shortenAddress(address, numLetters = 4) {
    return address.slice(0, numLetters) + '...' + address.slice(address.length - numLetters);
}
