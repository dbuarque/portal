/**
 * Created by istrauss on 5/12/2017.
 */

import _merge from 'lodash/merge';

const config = {
    development: {
        urls: {
            api: window.stellarport.remoteBackend ?
                window.stellarport.networkMode === 'public' ?
                    'https://stellar.api.stellarport.io' : 'https://test.stellar.api.stellarport.io' :
                'http://localhost:1337'
        }
    },
    test: {
        urls: {
            api: 'https://test.stellar.api.stellarport.io'
        },
        networkMode: 'test'
    },
    beta: {
        urls: {
            api: 'https://beta.stellar.api.stellarport.io'
        },
        networkMode: 'public'
    },
    production: {
        urls: {
            api: 'https://stellar.api.stellarport.io'
        },
        networkMode: 'public'
    },
    all: {
        stellar: {
            nativeAssetCode: 'XLM',
            minimumNativeBalance: 20
        },
        publicKey: 'GCPXPQXHLSZ2OSVYDC5DXCMBSE5ODXCGBWRVFS4TVXN737EDOWZUT6PS',
        offerFeeFactor: 0
    }
};

Object.assign(window.stellarport, _merge(config.all, config[window.stellarport.env]));
