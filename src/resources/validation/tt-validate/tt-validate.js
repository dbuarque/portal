/**
 * Created by istrauss on 4/11/2016.
 */

import {inject, bindable, TaskQueue, customAttribute} from 'aurelia-framework';
import _find from 'lodash/find';
import {EventHelper} from '../../helpers/event-helper';
import {RequiredValidator, NumberValidator, EmailValidator, MinlengthValidator, MaxlengthValidator} from '../resources/validators/validators';

/**
 * Adds validation functionality to a dom control
 * @class TtValidateCustomAttribute
 * @uses customAttribute
 */
@customAttribute('tt-validate')
@inject(Element, TaskQueue)
export class TtValidateCustomAttribute {

    /**
     * BINDABLE - The validation manager that should validate this element.
     * @property {ValidationManager} manager
     */
    @bindable manager;

    /**
     * BINDABLE - a key corresponding to a managed validation instruction. The instruction corresponding to this key will be used to validate this element.
     * @property {String} key
     */
    @bindable key;

    /**
     * BINDABLE - a valid JQuery selector by which to locate the element on which to show the validation styles/tooltip. If this is not defined, the element that this custom attribute is declared on will be used.
     * @property {String} [elementSelector]
     */
    @bindable elementSelector;

    /**
     * BINDABLE - locate the value binding using this attribute name.
     * @property {String} [valueProp='value']
     */
    @bindable valueProp = 'value';

    validationParticipants = [];
    validationParticipantResults = {};

    constructor(element, taskQueue) {
        this.element = element;
        this.taskQueue = taskQueue;
    }

    created(view) {
        this.view = view;
    }

    attached() {
        if (!this.manager || !this.key) {
            return;
        }

        this.keys = Array.isArray(this.key) ? this.key : [this.key];

        this.$element = $(this.element);
        this.$validatedElement = this.elementSelector ? this.$element.find(this.elementSelector) : this.$element;

        this.processBindings();

        //Must be in taskQueue because if validation occurs before a control is fully rendered, it will go red even if the user hasn't interacted with it yet.
        //This is because it is being validated on the inital bind (which can bind to undefined, 0 or null).
        //TODO better way to ensure no initial red controls?
        this.taskQueue.queueTask(() => {
            this.addValidationInstructionToManager();
            this.participateInValidation();
            this.createUI();
        });
    }

    detached() {
        //Must be in taskQueue because the validationParticipant is created above in attached() in a taskQueue
        this.taskQueue.queueTask(() => {
            this.cleanUp();
        });
    }

    cleanUp() {
        if (this.validationParticipants && this.validationParticipants.length > 0) {
            this.validationParticipants.forEach(p => {
                p.destroy();
            });
            this.observer.unsubscribe(this.boundValidate);
        }

        try {
            this.$validatedElement.tooltipster('destroy');
        }
        catch (e) {
            //Its ok if this fails. Can fail because tooltipster has not been created yet(because the creation is still in the taskQueue)
        }
    }

    addValidationInstructionToManager() {
        //validators only get added for the first key
        this.manager.addInstruction({
            key: this.keys[0],
            title: this.$element.attr('title'),
            validators: this.getValidators()
        });
    }

    createUI() {
        this.$validatedElement.tooltipster({
            content: '',
            theme: 'tt-validation',
            positionTracker: true,
            contentAsHTML: true,
            functionBefore: (instance, helper) => {
                return this.$validatedElement.hasClass('invalid') && (this.$validatedElement.hasClass('touched') || this.$validatedElement.hasClass('validated'));
            }
        });

        this.$validatedElement.on('focusout', e => {
            this.$validatedElement.addClass('touched');
            this.validate();
        });

        this.$validatedElement.removeClass('touched');
        this.$validatedElement.removeClass('valid');
        this.$validatedElement.removeClass('invalid');
    }

    participateInValidation() {
        this.keys.forEach(key => {
            let validationInstruction = this.manager.getInstruction(key);

            if (!validationInstruction) {
                return;
            }

            this.boundValidate = this.validateOnObserverChange.bind(this);

            let participant = validationInstruction.addParticipant(this.observer.getValue.bind(this.observer), this.onValidated.bind(this));
            this.validationParticipants.push(participant);

            this.observer.subscribe(this.boundValidate);
        });
    }

    validateOnObserverChange(newValue, oldValue) {
        //Need to return here to avoid times when inital value binding is actually done after this (sometimes happens).
        if (!newValue && !oldValue) {
            return;
        }

        this.validate();
    }

    validate() {
        for (let i = 0; i <= this.validationParticipants.length - 1; i++) {
            let valid = this.validationParticipants[i].validate();
            if (!valid) {
                break;
            }
        }
    }

    onValidated(result, message, manuallyTriggered = null, participant) {
        if (manuallyTriggered) {
            this.$validatedElement.addClass('validated');
        }

        this.validationParticipantResults[participant.instruction.key] = result;

        if (result) {
            const participantKeys = Object.keys(this.validationParticipantResults);
            for (let i = 0; i < participantKeys.length; i++) {
                let key = participantKeys[i];
                if (!this.validationParticipantResults[key]) {
                    result = false;
                    let participant = _find(this.validationParticipants, {key});
                    if (participant) {
                        participant.validate();
                        return;
                    }
                }
            }
        }

        this.$validatedElement.removeClass((!result ? '' : 'in') + 'valid');
        this.$validatedElement.addClass((!result ? 'in' : '') + 'valid');

        this.generateTooltipContent(result, message);

        EventHelper.emitEvent(this.$validatedElement[0], 'validated', {
            detail: {
                result,
                message
            }
        });
    }

    processBindings() {
        //check for a value binding in this.view (that is declared on this.element).
        //this.view will only have a value binding that is declared on this.element if tt-validate was not declared on a custom-element
        this.findInterestingBindings(this.view.bindings, true);

        //No value binding? Perhaps tt-validate was declared on a custom-element
        if (!this.observer) {
            //We need to locate the correct custom-element from all the controllers in this view (i.e. the one tt-validate was declared on).
            //To do this we search through all the controllers for one where one of the properties of controller.view.container === this
            let parentController = this.getParentController(this.view.controllers);

            //This was declared on a custom element? Look for a value binding into it.
            if (parentController) {
                this.findInterestingBindings(parentController.boundProperties.map(boundProp => boundProp.binding));
            }
        }

        if (!this.observer) {
            throw new Error('tt-validate needs a sibling value binding');
        }
    }

    getValidators() {
        let validators = [];

        if (this.$element[0].hasAttribute('required')) {
            validators.push(new RequiredValidator());
        }

        if (this.$element[0].hasAttribute('is-number')) {
            validators.push(new NumberValidator());
        }

        if (this.$element[0].hasAttribute('email')) {
            validators.push(new EmailValidator());
        }

        //let minlengthBinding = _find(this.interestingBindings, {targetProperty: 'minlength'});
        //let minlength = minlengthBinding ? minlengthBinding.targetObserver.getValue() : this.$element.attr('minlength');
        let minlength = this.$element.attr('minlength');
        if (minlength) {
            validators.push(new MinlengthValidator(parseInt(minlength, 10)));
        }

        //let maxlengthBinding = _find(this.interestingBindings, {targetProperty: 'maxlength'});
        //let maxlength = maxlengthBinding ? maxlengthBinding.targetObserver.getValue() : this.$element.attr('maxlength');
        let maxlength = this.$element.attr('maxlength');
        if (maxlength) {
            validators.push(new MaxlengthValidator(parseInt(maxlength, 10)));
        }

        return validators;
    }

    getParentController(controllers) {
        return _find(controllers, controller => {
            return controller.view && _find(Object.keys(controller.view.container), key => controller.view.container[key] === this);
        });
    }

    findInterestingBindings(bindings, checkElement) {
        //If checkElement is specified, we need to filter bindings to make sure they are declared on this.element
        let interestingBindings = !checkElement ? bindings : bindings.filter(binding => {
            return binding.target === this.element;
        });

        let valueBinding = _find(interestingBindings, binding => {
            return binding.targetProperty === this.valueProp;
        });

        if (valueBinding) {
            this.interestingBindings = interestingBindings;
            this.observer = valueBinding.targetObserver;
        }
    }

    generateTooltipContent(result, message) {
        if (result || !message) {
            this.$validatedElement.tooltipster('disable');
        }
        else {
            this.$validatedElement.tooltipster('enable');
            let newMessage = '<i class="fa fa-warning"></i>&nbsp;' + message;
            if ( this.$validatedElement.tooltipster('content') !== newMessage) {
                this.$validatedElement.tooltipster('content', newMessage);
            }
        }
    }
}
