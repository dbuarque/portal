/**
 * Created by istrauss on 9/25/2017.
 */
import {shortenAddress} from '../helpers/misc';

export class ShortenAddressValueConverter {
    toView(address, numLetters = 4) {
        return shortenAddress(address, numLetters);
    }
}
