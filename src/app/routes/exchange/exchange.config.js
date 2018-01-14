/**
 * Created by Ishai on 3/27/2016.
 */

import {PLATFORM} from 'aurelia-pal';
import {transient} from 'aurelia-framework';

@transient()
export class ExchangeConfig {

    constructor() {
        return {
            routes: [
                {
                    route: [''],
                    redirect: 'choose'
                },
                {
                    route: ['choose'],
                    name: 'choose',
                    moduleId: PLATFORM.moduleName('./resources/choose/choose'),
                    title: 'Choose Asset Pair'
                },
                {
                    route: [':sellingType/:sellingCode/:sellingIssuer/:buyingType/:buyingCode/:buyingIssuer'],
                    name: 'detail',
                    moduleId: PLATFORM.moduleName('./resources/detail/detail', 'exchange-detail'),
                    title: 'Detail',
                    breadcrumb: true
                }
            ]
        };
    }
}
