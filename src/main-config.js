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
            //horizon: 'https://horizon.stellar.org'
            horizon: 'https://horizon-testnet.stellar.org/'
        }
    },
    test: {
        urls: {
            api: 'http://test.api.lupoex.com',
            horizon: 'https://horizon-testnet.stellar.org/'
        }
    },
    production: {
        urls: {
            api: 'http://api.lupoex.com',
            horizon: 'https://horizon.stellar.org'
        }
    },
    all: {
        stellar: {
            nativeAssetCode: 'XLM'
        }
    }
};

Object.assign(window.lupoex, {env}, _merge(config.all, config[env]));
