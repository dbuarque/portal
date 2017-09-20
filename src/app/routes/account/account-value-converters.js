/**
 * Created by istrauss on 9/20/2017.
 */

export class IssuerHtmlValueConverter {
    toView(issuer) {
        let html = '';
        html += issuer.homeDomain ? '<div class="primary-text left-align">' + issuer.homeDomain + '</div>' : '<div class="left-align">unknown</div>';
        html += '<div class="left-align" style="font-size: 10px;">' + issuer.accountId + '</div>';
        return html;
    }
}
