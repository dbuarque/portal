/**
 * Created by istrauss on 9/25/2017.
 */

export function shortenAddress(address, numLetters = 4) {
    return address ? address.slice(0, numLetters) + '...' + address.slice(address.length - numLetters) : address;
}

export function shortenedAddressLink(address, numLetters = 4) {
    if (!address) {
        return $('<span>' + address + '</span>');
    }

    const span = $('<span>' + address.slice(0, numLetters) + ' <a style="font-weight: bold" href="javascript:void(0)" title="' + address + '">...</a> ' + address.slice(address.length - numLetters) + '</span>');
    const link = span.find('a');

    link.tooltipster({
        trigger: 'custom',
        triggerClose: {
            click: true,
            tap: true
        }
    })
        .click(e => {
            link.tooltipster('open');
            e.stopPropagation();
        });

    return span[0];
}
