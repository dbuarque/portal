
import {inject, TaskQueue} from 'aurelia-framework';

@inject(TaskQueue)
export class ReflectModelBindingBehavior {

    constructor(taskQueue) {
        this.taskQueue = taskQueue;
    }

    bind(binding, scope, interceptor) {
        $(binding.target).on('keyup change', this.reflectModel.bind(this, binding, scope));
    }

    unbind(binding, scope) {
        $(binding.target).off('keyup change');
    }

    reflectModel(binding, scope) {
        this.taskQueue.queueTask(() => {
             $(binding.target).val(
                 binding.sourceExpression.evaluate(scope, binding.lookupFunctions)
             );
        });
    }
}
