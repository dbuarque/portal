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
}
