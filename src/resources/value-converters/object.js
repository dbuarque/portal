/**
 * Created by istrauss on 3/31/2016.
 */

export class ObjectValuesValueConverter {
    toView(obj) {
        return Object.keys(obj).map(key => {
            return obj[key];
        });
    }
}


export class ObjectKeysValueConverter {
    toView(obj) {
        return Object.keys(obj);
    }
}

//returns an object as [{key, value}]
export class ObjectToArrayValueConverter {
    toView(obj) {
        return Object.keys(obj).map(key => {
            return {key, value: obj[key]};
        });
    }
}
