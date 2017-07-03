/**
 * Created by istrauss on 5/12/2017.
 */

import _merge from 'lodash.merge';

let env;

switch (window.location.hostname) {
    case 'localhost':
        env = 'development';
        break;
    case 'test.lupoex.com':
        env = 'test';
        break;
    case 'lupoex.com':
        env = 'production';
        break;
    default:
        throw new Error('Unknown environment');
}

const config = {
    development: {
        urls: {
            api: 'http://localhost:1337',
            horizon: 'https://horizon.stellar.org'
            //horizon: 'https://horizon-testnet.stellar.org/'
        },
        networkMode: 'public'
    },
    test: {
        urls: {
            api: 'http://test.api.lupoex.com',
            horizon: 'https://horizon-testnet.stellar.org/'
        },
        networkMode: 'test'
    },
    production: {
        urls: {
            api: 'https://api.lupoex.com',
            horizon: 'https://horizon.stellar.org'
        },
        networkMode: 'public'
    },
    all: {
        stellar: {
            nativeAssetCode: 'XLM',
            minimumNativeBalance: 20
        },
        publicKey: 'GACGNVW44F7GNUVALL2YFEHAVBVWO7WQROZ2ZRSYVL3H7UB4QPEUVJSN',
        offerFeeFactor: 0.00025
    }
};

Object.assign(window.lupoex, {env}, _merge(config.all, config[env]));
