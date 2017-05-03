/**
 * Created by Ishai on 3/27/2016.
 */

import {PLATFORM} from 'aurelia-pal';
import {transient} from 'aurelia-framework';

@transient()
export default class AppConfig {

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
                    title: 'Profile',
                    breadcrumb: true
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
                    name: 'account',
                    moduleId: PLATFORM.moduleName('./routes/open-offers/open-offers'),
                    title: 'Open Offers',
                    breadcrumb: true
                },
                {
                    route: ['operation-history'],
                    name: 'operation-history',
                    moduleId: PLATFORM.moduleName('./routes/operation-history/operation-history'),
                    title: 'Operation History',
                    breadcrumb: true
                },
                {
                    route: ['effect-history'],
                    name: 'effect-history',
                    moduleId: PLATFORM.moduleName('./routes/effect-history/effect-history'),
                    title: 'Effect History',
                    breadcrumb: true
                }
            ]
        };
    }
}
