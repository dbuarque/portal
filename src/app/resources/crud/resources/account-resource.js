/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import BaseResource from './base-resource';
import {AssetPairToUrlValueConverter} from '../value-converters';

@inject(AssetPairToUrlValueConverter)
export class AccountResource extends BaseResource {
    constructor(assetPairToUrl) {
        super('/Account');

        this.assetPairToUrl = assetPairToUrl;
    }

    /**
     * Gets the offers for an account for a specific market
     * @param accountId
     * @param assetPair
     * @returns {*}
     */
    offersForMarket(accountId, assetPair) {
        return this.get('/' + accountId + '/Offers' + this.assetPairToUrl.toView(assetPair));
    }

    /**
     * Gets the trustlines for an account for a specific market
     * @param accountId
     * @param assetPair
     * @returns {*}
     */
    assetPairTrustlines(accountId, assetPair) {
        return this.get('/' + accountId + '/Trustlines' + this.assetPairToUrl.toView(assetPair));
    }
}
