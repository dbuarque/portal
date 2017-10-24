
import {inject, TaskQueue} from 'aurelia-framework';

@inject(TaskQueue)
export class ReflectModelBindingBehavior {

    constructor(taskQueue) {
        this.taskQueue = taskQueue;
    }

    bind(binding, scope, interceptor) {
        binding.originalUpdateSource = binding.updateSource.bind(binding);
        binding.updateSource = this.updateSourceAndReflectModel.bind(this, binding, scope);
        //$(binding.target).on('keyup', e => {
        //    binding.updateSource($(binding.target).val());
        //});
    }

    unbind(binding, scope) {
        binding.updateSource = binding.originalUpdateSource;
        //$(binding.target).off('keyup');
    }

    reflectModel(binding, scope) {
        this.taskQueue.queueTask(() => {
             $(binding.target).val(
                 binding.sourceExpression.evaluate(scope, binding.lookupFunctions)
             );
        });
    }

    updateSourceAndReflectModel(binding, scope, newValue) {
        binding.originalUpdateSource(newValue);
        $(binding.target).val(
            binding.sourceExpression.evaluate(scope, binding.lookupFunctions)
        );
    }
}
