/**
 * Created by istrauss on 1/7/2017.
 */

import {inject} from 'aurelia-framework';
import {UPDATE_ASSET_PAIR} from './exchange-action-types';
import {AssetResource} from 'app-resources';

@inject(AssetResource)
export class ExchangeActionCreators {

    constructor(assetResource) {
        this.assetResource = assetResource;
    }

    updateAssetPair(assetPair) {
        return async (dispatch, getState) => {
            if (!assetPair) {
                return;
            }

            const oldAssetPair = getState().exchange.assetPair;

            if (
                oldAssetPair &&
                compareAssets(assetPair.buying, oldAssetPair.buying) &&
                compareAssets(assetPair.selling, oldAssetPair.selling)
            ) {
                // newAssetPair is the same as the oldAssetPair. No need to update.
                return;
            }

            const assets = await Promise.all([
                this.assetWithIssuer(assetPair, oldAssetPair, 'buying'),
                this.assetWithIssuer(assetPair, oldAssetPair, 'selling')
            ]);

            return dispatch({
                type: UPDATE_ASSET_PAIR,
                payload: {
                    buying: assets[0],
                    selling: assets[1]
                }
            });
        };
    }

    /**
     * Takes a newAsset and returns the asset with the issuer populated (i.e. as a full object)
     * @param newAssetPair
     * @param oldAssetPair
     * @param type
     * @returns {Promise.<*>}
     */
    async assetWithIssuer(newAssetPair, oldAssetPair, type) {
        const newAsset = newAssetPair[type];

        if (!newAsset) {
            return oldAssetPair ? oldAssetPair[type] : null;
        }

        if (typeof newAsset.issuer === 'object') {
            return newAsset;
        }

        if (oldAssetPair) {
            if (compareAssets(newAsset, oldAssetPair.selling)) {
                return oldAssetPair.selling;
            }

            if (compareAssets(newAsset, oldAssetPair.buying)) {
                return oldAssetPair.buying;
            }
        }

        if (newAsset.type === 'native') {
            return newAsset;
        }

        const assetWithIssuer = await this.assetResource.asset(newAsset.code, newAsset.issuer);

        return {
            code: assetWithIssuer.assetCode,
            type: assetWithIssuer.assetType,
            issuer: assetWithIssuer.issuer
        };
    }
}

function compareAssets(newAsset, oldAsset) {
    if (!oldAsset || !newAsset) {
        return !oldAsset && !newAsset;
    }

    const newIssuerAddress = newAsset.issuer && newAsset.issuer.accountId ? newAsset.issuer.accountId : newAsset.issuer;
    const newCode = newAsset.code;
    const oldIssuerAddress = oldAsset.issuer ? oldAsset.issuer.accountId : newAsset.issuer;
    const oldCode = oldAsset.code;

    return newIssuerAddress === oldIssuerAddress && newCode === oldCode;
}
