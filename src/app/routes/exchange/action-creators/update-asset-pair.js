import {inject} from 'aurelia-framework';
import {actionCreator} from 'au-redux';
import {UPDATE_ASSET_PAIR} from '../exchange.action-types';
import {AssetResource, assetsAreDifferent} from 'app-resources';

@actionCreator()
@inject(AssetResource)
export class UpdateAssetPairActionCreator {

    constructor(assetResource) {
        this.assetResource = assetResource;
    }

    create(assetPair) {
        return async (dispatch, getState) => {
            if (!assetPair) {
                return;
            }

            assetPair.buying.type = assetPair.buying.type.replace('credit_', '');
            assetPair.selling.type = assetPair.selling.type.replace('credit_', '');

            const oldAssetPair = getState().exchange.assetPair;

            if (
                oldAssetPair &&
                !assetsAreDifferent(assetPair.buying, oldAssetPair.buying) &&
                !assetsAreDifferent(assetPair.selling, oldAssetPair.selling)
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
            if (!assetsAreDifferent(newAsset, oldAssetPair.selling)) {
                return oldAssetPair.selling;
            }

            if (!assetsAreDifferent(newAsset, oldAssetPair.buying)) {
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
            issuer: assetWithIssuer.issuer,
            issuerId: assetWithIssuer.issuerId
        };
    }
}
