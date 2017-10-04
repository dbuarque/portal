/**
 * Created by istrauss on 3/21/2016.
 */

import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';

export default class StatelessRouter {

    constructor(routes) {
        this.pipelineSteps = [];
        this.navigation = routes.map(navModel => {
            let newNavModel = {config: navModel};
            newNavModel.settings = navModel.settings;
            return newNavModel;
        });
    }

    displayDefault() {
        let defaultCustomElementConfig = _find(this.navigation, navModel => navModel.config.default === true);
        if (defaultCustomElementConfig) {
            this.navigateToRoute(defaultCustomElementConfig.config.name);
        }
    }

    navigateToRoute(name, params) {
        let newCustomElementConfig = _find(this.navigation, navModel => navModel.config.name === name);
        if (!newCustomElementConfig) {
            throw new Error('Viewport Manager could not resolve custom element named ' + name + 'in its navigation.');
        }

        this.navigatingToInstruction = newCustomElementConfig;
        this.navigationParams = params;
        this.stepIntoPipeline();
    }

    stepIntoPipeline(index) {
        index = index || 0;

        if (index < this.pipelineSteps.length) {
            let pipelineStep = this.pipelineSteps[index];
            let stepIntoNextPipelineStep = this.stepIntoPipeline.bind(this, index + 1);
            stepIntoNextPipelineStep.cancel = this.cancelPipeline.bind(this);
            pipelineStep.instruction.run(this.navigatingToInstruction, stepIntoNextPipelineStep);
        }
        else {
            this.currentInstruction = this.navigatingToInstruction;
            this.navigatingToInstruction = null;
        }
    }

    cancelPipeline(routeName) {
        this.navigatingToInstruction = null;
        if (routeName) {
            this.navigateToRoute(routeName);
        }
    }

    addPipelineStep(instruction, id) {
        let step = {
            instruction,
            id
        };
        this.pipelineSteps.push(step);
    }

    removePipelineStep(id) {
        if (id) {
            let pipelineStepIndex = _findIndex(this.pipelineSteps, {id: id});

            if (pipelineStepIndex !== -1) {
                this.pipelineSteps.splice(pipelineStepIndex, 1);
            }
        }
    }
}
