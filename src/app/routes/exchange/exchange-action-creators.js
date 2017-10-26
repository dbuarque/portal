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
                this.assetWithIssuer(assetPair.buying, oldAssetPair),
                this.assetWithIssuer(assetPair.selling, oldAssetPair)
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
     * @param newAsset
     * @param oldAssetPair
     * @returns {Promise.<*>}
     */
    async assetWithIssuer(newAsset, oldAssetPair) {
        if (typeof newAsset.issuer === 'object') {
            return newAsset;
        }

        if (compareAssets(newAsset, oldAssetPair.selling)) {
            return oldAssetPair.selling;
        }

        if (compareAssets(newAsset, oldAssetPair.buying)) {
            return oldAssetPair.buying;
        }

        if (newAsset.type === 'native') {
            return newAsset;
        }

        return this.assetResource.asset(newAsset.code, newAsset.issuer);
    }
}

function compareAssets(newAsset, oldAsset) {
    if (!oldAsset) {
        return false;
    }

    const newIssuerAddress = newAsset.issuer && newAsset.issuer.accountId ? newAsset.issuer.accountId : newAsset.issuer;
    const newCode = newAsset.code;
    const oldIssuerAddress = oldAsset.issuer ? oldAsset.issuer.accountId : newAsset.issuer;
    const oldCode = oldAsset.code;

    return newIssuerAddress === oldIssuerAddress && newCode === oldCode;
}
