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
        let html = '';
        html += issuer.homeDomain ? '<div class="primary-text left-align">' + issuer.homeDomain + '</div>' : '<div class="left-align">unknown</div>';
        html += '<div class="left-align" style="font-size: 10px;">' + this.shortenAddress.toView(issuer.accountId, 6) + '</div>';
        return html;
    }
}
