/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import {ModalService} from 'global-resources';
import BaseResource from './base-resource';

@inject(ModalService)
export default class MarketResource extends BaseResource {
    constructor(modalService) {
        super('/Market');

        this.modalService = modalService;
    }

    /**
     * Gets the top then markets (when ordered by order).
     * @param [order='trade_count'] - API defaults ordering to trade_count (you get the top ten markets by trade_count)
     * @returns {*}
     */
    topTen(order) {
        return this.get('/TopTen', {
            order
        });
    }

    /**
     * Finds a single market
     * @param soldAssetCode
     * @param soldAssetIssuer
     * @param boughtAssetCode
     * @param boughtAssetIssuer
     * @returns {*}
     */
    findOne(soldAssetCode, soldAssetIssuer, boughtAssetCode, boughtAssetIssuer) {
        return this.get('/FindOne', {
            soldAssetCode,
            soldAssetIssuer,
            boughtAssetCode,
            boughtAssetIssuer
        });
    }

    /**
     * Gets a list of ticker data.
     * @param resolution
     * @param assetPair
     * @param [from]
     * @param [to]
     * @returns {*}
     */
    bars(resolution, assetPair, from, to) {
        const action = '/' + assetPair.selling.code + '/' + (assetPair.selling.issuer || 'native') + '/' + assetPair.buying.code + '/' + (assetPair.buying.issuer || 'native') + '/Bars';
        return this.get(action, {
            resolution,
            from,
            to
        });
    }

    /**
     * Gets a list of ticker data.
     * @param resolution
     * @param assetPair
     * @param [priorto]
     * @returns {*}
     */
    lastPriorBar(resolution, assetPair, priorto) {
        const action = '/' + assetPair.selling.code + '/' + (assetPair.selling.issuer || 'native') + '/' + assetPair.buying.code + '/' + (assetPair.buying.issuer || 'native') + '/LastPriorBar';
        return this.get(action, {
            resolution,
            priorto
        });
    }
}
