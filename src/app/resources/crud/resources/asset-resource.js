/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import {ModalService} from 'global-resources';
import BaseResource from './base-resource';

@inject(ModalService)
export class AssetResource extends BaseResource {
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
     * Finds a single asset
     * @param code
     * @param issuer
     * @returns {*}
     */
    asset(code, issuer) {
        return this.get('/' + code + '/' + issuer);
    }
}
