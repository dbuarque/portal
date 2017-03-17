/**
 * Created by istrauss on 3/22/2016.
 */

import {customAttribute, inject, bindable, bindingMode, View} from 'aurelia-framework';
import {EventHelper} from '../../helpers/event-helper';

/**
 * Makes a bootstrap card (div.card) collapsible.
 * @class CollapsiblePanelCustomAttribute
 */
@customAttribute('collapsible-card')
@inject(Element)
export class CollapsibleCardCustomAttribute {

    /**
     * BINDABLE(default: twoWay) - Controls whether the card is open or not.
     *
     * @property isOpen
     * @type Boolean
     * @default false
     */
    @bindable({defaultBindingMode: bindingMode.twoWay}) isOpen = false;

    /**
     * BINDABLE - Controls whether the card can be toggled open/close.
     *
     * @property toggleDisabled
     * @type Boolean
     * @default false
     */
    @bindable toggleDisabled = false;

    /**
     * BINDABLE - Controls whether the card's content is disabled (via an overlay).
     *
     * @property contentDisabled
     * @type Boolean
     * @default false
     */
    @bindable contentDisabled = false;

    /**
     * BINDABLE - Controls whether the card's toggle state cascades to children.
     *
     * @property cascadeToChildren
     * @type Object
     * @default false
     */
    @bindable cascadeToChildren = false;

    constructor(element, eventHelper) {
        this.element = element;
        this.$element = $(element);
    }

    created(view) {
        this.view = view;
    }

    attached() {
        this.bodyEl = this.$element.find('.card-body').first();
        this.headingEl = this.$element
            .find('.card-heading').first()
            .click(this.toggleOnClick.bind(this));

        if (this.headingEl.length === 0 || this.bodyEl.length === 0) {
            return;
        }

        this.$element.addClass('collapsible-card');

        this.toggleContainer = $('<div class="toggle-container"></div>');
        this.headingEl.prepend(this.toggleContainer);

        this.openToggle = $('<i class="fa fa-chevron-right"></i>');
        this.closeToggle = $('<i class="fa fa-chevron-down"></i>');
        this.toggleContainer.append(this.openToggle);
        this.toggleContainer.append(this.closeToggle);

        this.contentDisabledOverlay = $('<div class="content-disabled-overlay"></div>');
        this.bodyEl.prepend(this.contentDisabledOverlay);

        this.isOpen = !this.isOpen;
        this.toggle();
    }

    isOpenChanged() {
        if (!this.bodyEl) {
            return;
        }

        this.openToggle.css('display', this.isOpen ? 'none' : 'inline-block');
        this.closeToggle.css('display', this.isOpen ? 'inline-block' : 'none');
        this.bodyEl.css('display', this.isOpen ? 'block' : 'none');

        EventHelper.emitEvent(this.element, this.isOpen ? 'opened' : 'closed');
    }

    toggleDisabledChanged() {
        if (this.headingEl) {
            this.toggleDisabled ? this.headingEl.addClass('disabled') : this.headingEl.removeClass('disabled');
        }
    }

    contentDisabledChanged() {
        if (this.bodyEl) {
            this.contentDisabled ? this.bodyEl.addClass('disabled') : this.bodyEl.removeClass('disabled');
        }
    }

    toggleOnClick(e) {
        if (e && !this.isElementCollapsible(e.target)) {
            return;
        }

        this.toggle();
    }

    /**
     * Toggle the card open
     * @method open
     */
    open(options = {}) {
        //toggle will set back to true.
        this.isOpen = false;
        this.toggle(options);
    }

    /**
     * Toggle the card closed
     * @method close
     */
    close(options = {}) {
        //toggle will set back to false.
        this.isOpen = true;
        this.toggle(options);
    }

    /**
     * Toggle the card open/closed
     * @method toggle
     */
    toggle(options = {}) {
        if (this.toggleDisabled) {
            return;
        }

        this.isOpen = !this.isOpen;

        if (this.cascadeToChildren) {
            if (!this.children) {
                this.getCollapsiblePanelChildren();
            }

            if (this.cascadeToChildren) {
                this.children.forEach(child => {
                    if (this.isOpen && (this.cascadeToChildren.open || options.cascadeToChildren)) {
                        child.open({cascadeToChildren: options.cascadeToChildren});
                    }
                    if (!this.isOpen && (this.cascadeToChildren.close || options.cascadeToChildren)) {
                        child.close({cascadeToChildren: options.cascadeToChildren});
                    }
                });
            }
        }
    }

    getCollapsiblePanelChildren() {
        this.children = this.view.children.reduce((_children, child) => {
            return _children.concat(this.getViewsCollapsiblePanelChildren(child));
        }, []);
    }

    getViewsCollapsiblePanelChildren(view) {
        let children = [];

        if (!(view instanceof View)) {
            children = view.children.reduce((_children, child) => {
                return _children.concat(this.getViewsCollapsiblePanelChildren(child));
            }, []);
        }
        else {
            children = view.controllers
                .filter(controller => {
                    return controller.viewModel instanceof CollapsiblePanelCustomAttribute;
                })
                .map(controller => controller.viewModel);
        }

        return children;
    }

    /**
     * Determines if a certain DOM element can collapse the card
     * @private
     * @method open
     * @param element {Element}
     * @return {Boolean} true if the DOM element is inside the card's card-heading element and does not contain no-collapse attribute
     */
    isElementCollapsible(element) {
        if (element.hasAttribute('no-collapse')) {
            return false;
        }
        if (element === this.headingEl[0]) {
            return true;
        }
        return this.isElementCollapsible($(element).parent()[0]);
    }

    /**
     * Fired when the card is toggled open
     *
     * @event opened
     */

    /**
     * Fired when the card is toggled closed
     *
     * @event closed
     */
}
