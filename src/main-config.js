/**
 * Created by istrauss on 5/12/2017.
 */

import _merge from 'lodash.merge';

const config = {
    development: {
        urls: {
            api: 'http://localhost:1337',
            horizon: 'https://horizon.stellar.org'
            //api: 'http://localhost:1337',
            //horizon: 'https://horizon-testnet.stellar.org/'
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

Object.assign(window.lupoex, _merge(config.all, config[window.lupoex.env]));
