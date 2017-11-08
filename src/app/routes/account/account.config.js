/**
 * Created by Ishai on 3/27/2016.
 */

import {PLATFORM} from 'aurelia-pal';
import {transient} from 'aurelia-framework';

@transient()
export class AccountConfig {

    constructor() {
        return {
            routes: [
                {
                    route: [''],
                    redirect: 'profile'
                },
                {
                    route: ['profile'],
                    name: 'profile',
                    moduleId: PLATFORM.moduleName('./routes/profile/profile'),
                    title: 'Profile'
                },
                {
                    route: ['asset-balances'],
                    name: 'asset-balances',
                    moduleId: PLATFORM.moduleName('./routes/asset-balances/asset-balances'),
                    title: 'Asset Balances',
                    breadcrumb: true
                },
                {
                    route: ['open-offers'],
                    name: 'open-offers',
                    moduleId: PLATFORM.moduleName('./routes/open-offers/open-offers'),
                    title: 'Open Offers',
                    breadcrumb: true
                },
                {
                    route: ['history'],
                    name: 'effect-history',
                    moduleId: PLATFORM.moduleName('./routes/effect-history/effect-history'),
                    title: 'History',
                    breadcrumb: true
                }
            ]
        };
    }
}
