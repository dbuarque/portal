/**
 * Created by istrauss on 4/1/2016.
 */

export class CapitalizeFirstLetterValueConverter {
    toView(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

export class CamelToBrokenValueConverter {
    toView(string) {
        return string ?
            string.replace(/([a-z])([A-Z])/g, '$1 $2') :
            string;
    }
}

export class WithHttpProtocolValueConverter {
    toView(string = '') {
        return string.indexOf('http') === 0 ?
            string :
            'http://' + string;
    }
}
