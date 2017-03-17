/**
 * Created by istrauss on 3/17/2017.
 */

import {transient} from 'aurelia-framework';

@transient()
export default class AssetPairConfig {
    constructor() {
        return {
            alertConfig: {
                dimissible: true,
                type: 'info',
                message: 'There are some preset assets to choose from. Additionally, you can use any other asset that you know of (just make sure you set the correct issuer as well).'
            }
        };
    }
}

