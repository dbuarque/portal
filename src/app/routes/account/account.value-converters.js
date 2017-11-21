/**
 * Created by istrauss on 9/20/2017.
 */

import {inject} from 'aurelia-framework';
import {ShortenAddressValueConverter} from 'app-resources';

@inject(ShortenAddressValueConverter)
export class IssuerHtmlValueConverter {

    constructor(shortenAddress) {
        this.shortenAddress = shortenAddress;
    }

    toView(issuer) {
        if (!issuer) {
            return '';
        }

        let html = '';
        html += issuer.homeDomain ? '<span class="primary-text">' + issuer.homeDomain + '</span>' : '';
        html += ' <span style="font-size: 11px;">' + this.shortenAddress.toView(issuer.accountId, 6) + '</span>';
        return html;
    }
}
