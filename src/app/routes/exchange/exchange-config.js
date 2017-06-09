/**
 * Created by Ishai on 3/27/2016.
 */

import {PLATFORM} from 'aurelia-pal';
import {transient} from 'aurelia-framework';

@transient()
export default class Config {

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
                    moduleId: PLATFORM.moduleName('./routes/choose/choose'),
                    title: 'Choose Asset Pair'
                },
                {
                    route: [':buyingCode/:buyingIssuer/:sellingCode/:sellingIssuer'],
                    name: 'detail',
                    moduleId: PLATFORM.moduleName('./routes/detail/detail'),
                    title: 'Detail',
                    breadcrumb: true
                }
            ]
        };
    }
}
