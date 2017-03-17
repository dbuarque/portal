/**
 * Created by istrauss on 4/1/2016.
 */

export class CapitalizeFirstLetterValueConverter {
    toView(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
