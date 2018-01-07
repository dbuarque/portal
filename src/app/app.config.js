/**
 * Created by Ishai on 3/27/2016.
 */

import {PLATFORM} from 'aurelia-pal';
import {transient} from 'aurelia-framework';

@transient()
export class AppConfig {
    constructor() {
        return {
            routes: [
                {
                    route: [''],
                    redirect: 'home'
                },
                {
                    route: ['home'],
                    name: 'home',
                    moduleId: PLATFORM.moduleName('./routes/home/home'),
                    title: 'Home'
                },
                {
                    route: ['exchange'],
                    name: 'exchange',
                    moduleId: PLATFORM.moduleName('./routes/exchange/exchange', 'exchange'),
                    title: 'Exchange',
                    icon: '<div class="fa-layers">' +
                    '<i class="fal fa-desktop" data-fa-transform="grow-5"></i>' +
                    '<i class="fal primary-text fa-chart-line" data-fa-transform="shrink-4 up-2 right-1"></i>' +
                    '</div>',
                    details: 'View and even trade on the exchange entirely hosted on the stellar network',
                    breadcrumb: true,
                    nav: true
                },
                {
                    route: ['inflation-pool'],
                    name: 'inflationPool',
                    moduleId: PLATFORM.moduleName('./routes/inflation-pool/inflation-pool', 'inflation-pool'),
                    title: 'Inflation Pool',
                    icon: '<div class="fa-layers">' +
                        '<i class="fal fa-circle" data-fa-transform="grow-10"></i>' +
                        '<i class="fal fa-circle primary-text" data-fa-transform="grow-4"></i>' +
                        '<i class="fal fa-users" data-fa-transform="shrink-6 left-2"></i>' +
                        '</div>',
                    details: 'Help us help you. Join our inflation pool to receive weekly ' + window.stellarport.stellar.nativeAssetCode + ' distributions.',
                    breadcrumb: true,
                    nav: true
                },
                {
                    route: ['login'],
                    name: 'login',
                    moduleId: PLATFORM.moduleName('./routes/login/login', 'login'),
                    title: 'Login',
                    icon: '<div class="fa-layers">' +
                    '<i class="fal fa-square" data-fa-transform="grow-10"></i>' +
                    '<i class="fal fa-sign-in primary-text"></i>' +
                    '</div>',
                    details: 'Login using one of our several login methods to start transacting on the stellar network.',
                    breadcrumb: true,
                    nav: true,
                    anonymousRequired: true
                },
                //{
                //    route: ['create-account'],
                //    name: 'createAccount',
                //    moduleId: PLATFORM.moduleName('./routes/create-account/create-account', 'create-account'),
                //    title: 'Create Account',
                //    breadcrumb: true,
                //    anonymousRequired: true
                //},
                {
                    route: ['account'],
                    name: 'account',
                    moduleId: PLATFORM.moduleName('./routes/account/account', 'account'),
                    accountRequired: true,
                    title: 'My Account',
                    icon: '<div class="fa-layers">' +
                    '<i class="fal fa-square" data-fa-transform="grow-9"></i>' +
                    '<i class="fal fa-user primary-text" data-fa-transform="down-1 shrink-2"></i>' +
                    '</div>',
                    details: 'View your stellar account details.',
                    breadcrumb: true,
                    nav: true
                },
                {
                    route: ['send-payment/:type/:code/:issuer'],
                    name: 'send-payment',
                    moduleId: PLATFORM.moduleName('./routes/send-payment/send-payment', 'send-payment'),
                    accountRequired: true,
                    title: 'Payment',
                    icon: '<div class="fa-layers">' +
                    '<i class="fal fa-triangle" data-fa-transform="grow-6 rotate-90"></i>' +
                    '<i class="fal fa-paper-plane primary-text" data-fa-transform="up-2 shrink-4 rotate-60 left-1"></i>' +
                    '</div>',
                    details: 'Send a payment using ' + window.stellarport.stellar.nativeAssetCode + '.',
                    breadcrumb: true,
                    nav: true,
                    href: {
                        type: 'native',
                        code: window.stellarport.stellar.nativeAssetCode,
                        issuer: 'stellar'
                    }
                }
            ]
        };
    }
}
