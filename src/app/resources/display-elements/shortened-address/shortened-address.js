import {inject, bindable, containerless} from 'aurelia-framework';
import {shortenedAddressLink} from '../../helpers';

@containerless()
@inject(Element)
export class ShortenedAddressCustomElement {
    @bindable()
    address;

    @bindable()
    numLetters = 4;

    constructor(element) {
        this.element = element;
    }

    attached() {
        $(this.element).parent().find('.shortened-address')
            .append(
                shortenedAddressLink(this.address, this.numLetters)
            );
    }
}
