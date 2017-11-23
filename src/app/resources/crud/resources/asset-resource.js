/**
 * Created by istrauss on 5/11/2016.
 */

import {inject} from 'aurelia-dependency-injection';
import {ModalService} from 'global-resources';
import BaseResource from './base-resource';
import {AssetUrlValueConverter} from '../value-converters';

@inject(ModalService, AssetUrlValueConverter)
export class AssetResource extends BaseResource {
    constructor(modalService, assetUrl) {
        super('/Asset');

        this.modalService = modalService;
        this.assetUrl = assetUrl;
    }

    query(options) {
        return this.get('/', options);
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
     * @param type
     * @param code
     * @param issuer
     * @returns {*}
     */
    asset(type, code, issuer) {
        return this.get(
            this.assetUrl.toView({
                type,
                code,
                issuer
            })
        );
    }
}
