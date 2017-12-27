import {Container} from 'aurelia-framework';
import {SanitizeHTMLValueConverter} from 'aurelia-templating-resources';
import {shortenedAddressLink} from 'app-resources';

export function issuerElement(issuer) {
    if (!issuer) {
        return '';
    }

    let span = $('<span></span>');

    if (issuer.homeDomain) {
        span.append(
            $('<span class="primary-text">' + Container.instance.get(SanitizeHTMLValueConverter).toView(issuer.homeDomain) + '</span><br>')
        );
    }

    const addressSpan = $('<span style="font-size: 11px;"></span>');
    addressSpan.append(
        shortenedAddressLink(issuer.accountId, 6)
    );
    span.append(addressSpan);

    return span;
}
