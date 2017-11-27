/**
 * Created by istrauss on 5/12/2017.
 */

import _merge from 'lodash/merge';

const config = {
    development: {
        urls: {
            api: window.lupoex.remoteBackend ?
                window.lupoex.networkMode === 'public' ?
                    'https://api.lupoex.com' : 'https://test.api.lupoex.com' :
                'http://localhost:1337'
        }
    },
    test: {
        urls: {
            api: 'https://test.api.lupoex.com'
        },
        networkMode: 'test'
    },
    beta: {
        urls: {
            api: 'https://beta.api.lupoex.com'
        },
        networkMode: 'public'
    },
    production: {
        urls: {
            api: 'https://api.lupoex.com'
        },
        networkMode: 'public'
    },
    all: {
        stellar: {
            nativeAssetCode: 'XLM',
            minimumNativeBalance: 20
        },
        publicKey: 'GACGNVW44F7GNUVALL2YFEHAVBVWO7WQROZ2ZRSYVL3H7UB4QPEUVJSN',
        offerFeeFactor: 0
    }
};

Object.assign(window.lupoex, _merge(config.all, config[window.lupoex.env]));
