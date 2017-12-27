/**
 * Created by istrauss on 4/7/2016.
 */

import {inject, bindable, customElement, TaskQueue} from 'aurelia-framework';
import {ModalService} from './modal-service';

const defaultOptions = {
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: 0.5, // Opacity of modal background
    in_duration: 300, // Transition in duration
    out_duration: 200, // Transition out duration
    starting_top: '4%', // Starting top style attribute
    ending_top: '10%' // Ending top style attribute
};

@customElement('modal')
@inject(Element, TaskQueue, ModalService)
export class ModalCustomElement {
    @bindable instruction;

    constructor(element, taskQueue, modalService) {
        this.element = element;
        this.taskQueue = taskQueue;
        this.modalService = modalService;
    }

    attached() {
        const self = this;

        self.$modalWrapper = $(self.element).find('.modal-wrapper');

        self.$modal = self.$modalWrapper.find('.modal');

        self.options = Object.assign({}, defaultOptions, self.instruction.options);
        let userDefinedReady = self.options.ready;
        let userDefinedComplete = self.options.complete;

        self.options.ready = () => {
            $(self).trigger('modal.ready');
            self.ready = true;

            if (userDefinedReady) {
                userDefinedReady();
            }
        };

        self.options.complete = data => {
            if (userDefinedComplete) {
                userDefinedComplete();
            }

            this.modalService.close(self.instruction.modalId);

            self.taskQueue.queueTask(() => {
                const resolvedValue = self.closed ? self.result : Promise.reject(self.result);
                self.instruction.resolve(resolvedValue);
            });
        };

        self.$modal.modal(self.options);

        self.$modalWrapper.click(function(e) {
            if (self.options.dismissible && e.target === this ) {
                self.dismiss();
            }
        });

        self.$modal.modal('open');

        const zIndex = self.$modal.css('z-index');
        self.$modalWrapper.css('z-index', zIndex);
    }

    close(result) {
        this.closed = true;
        this.hide(result);
    }

    dismiss(result) {
        this.hide(result);
    }

    hide(result) {
        this.result = result;
        this.$modal.modal('close');
    }
}
