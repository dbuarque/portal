/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import {ModalService} from 'global-resources';
import BaseResource from './base-resource';

@inject(ModalService)
export default class AssetResource extends BaseResource {
    constructor(modalService) {
        super('/Asset');

        this.modalService = modalService;
    }

    codeMatch(match) {
        return this.get('/CodeMatch', {match});
    }

    issuersByCode(code) {
        return this.get('/IssuersByCode', {code});
    }

    codeIssuers(code) {
        return this.get('/CodeIssuers', {code});
    }

    /**
     * Finds a single market
     * @param code
     * @param issuer
     * @returns {*}
     */
    findOne(code, issuer) {
        return this.get('/FindOne', {
            code,
            issuer
        });
    }
}
