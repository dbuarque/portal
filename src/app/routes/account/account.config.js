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
                    moduleId: PLATFORM.moduleName('./resources/profile/profile'),
                    title: 'Profile',
                    icon: '<i class="fal fa-user"></i>',
                    details: 'General account information regarding your stellar account',
                    nav: true
                },
                {
                    route: ['asset-balances'],
                    name: 'asset-balances',
                    moduleId: PLATFORM.moduleName('./resources/asset-balances/asset-balances'),
                    title: 'Asset Balances',
                    icon: '<i class="fal fa-th"></i>',
                    details: 'Account asset balances on stellar',
                    breadcrumb: true,
                    nav: true
                },
                {
                    route: ['open-offers'],
                    name: 'open-offers',
                    moduleId: PLATFORM.moduleName('./resources/open-offers/open-offers'),
                    title: 'Open Offers',
                    icon: '<i class="fal fa-sliders-h"></i>',
                    details: 'All current open offers on stellar for your account',
                    breadcrumb: true,
                    nav: true
                },
                {
                    route: ['history'],
                    name: 'effect-history',
                    moduleId: PLATFORM.moduleName('./resources/effect-history/effect-history'),
                    title: 'History',
                    icon: '<i class="fal fa-history"></i>',
                    details: 'Your stellar account history',
                    breadcrumb: true,
                    nav: true
                }
            ]
        };
    }
}
