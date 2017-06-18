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
     * Gets a list of ticker data.
     * @param [order]
     * @returns {*}
     */
    topTen(order) {
        return this.get('/TopTen', {
            order
        });
    }
}
