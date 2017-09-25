/**
 * Created by istrauss on 9/25/2017.
 */

export class ShortenAddressValueConverter {
    toView(address, numLetters = 4) {
        return address.slice(0, numLetters) + '...' + address.slice(address.length - numLetters);
    }
}
