/**
 * Created by istrauss on 8/30/2017.
 */

import _get from 'lodash/get';

const defaultOptions = {
    pendAs: undefined,
    resolveAs: v => v,
    rejectAs: e => e
};

/**
 * Please be aware: If using this decorator along with @computedFrom, it must be declared ABOVE the computedFrom declaration
 * @param {{}} options
 * @param {*} [options.pendAs=undefined] - must be a primitive.
 * @param {*} [options.resolveAs=undefined] - can be a primitive or function.
 * @param {*} [options.rejectAs=undefined] - can be a primitive or function.
 * @returns {Function}
 */
export function awaitedBindable(options) {
    const _options = {
        ...defaultOptions,
        ...options
    };

    return function(target, name, descriptor) {
        if (!Promise || typeof Promise.prototype.then !== 'function') {
            return;
        }

        if (!descriptor.get) {
            throw new Error('awaitedBindable decorator must be used on a virtual getter.');
        }

        descriptor.get.dependencies = descriptor.get.dependencies || [];

        const oldGetter = descriptor.get;

        // Async bindings are particularly sensitive to being called repeatedly (because they will likely contain network calls).
        // To mitigate this we want to memoize the getter so that it will only be truely called when there is a change in the dependencies.
        const memoizedGetter = memoize(name, oldGetter);

        // We also want to ensure that the getter returns the appropriate values in the case that the result is a promise.
        descriptor.get = function() {
            const value = memoizedGetter.call(this);

            if (value instanceof Promise) {
                if (value.isPending()) {
                    value
                        .then(v => {
                            //Change the value so any bindings are recalculated
                            this[computedProperty(name)] = this[computedProperty(name)] + 1 || 1;
                        })
                        .catch(e => {
                            //Change the value so any bindings are recalculated
                            this[computedProperty(name)] = this[computedProperty(name)] + 1 || 1;
                        });

                    return _options.pendAs;
                }

                if (value.isResolved()) {
                    return typeof _options.resolveAs === 'function' ? _options.resolveAs(value.value()) : _options.resolveAs;
                }

                if (value.isRejected()) {
                    return typeof _options.rejectAs === 'function' ? _options.rejectAs(value.value()) : _options.rejectAs;
                }
            }

            return value;
        };

        descriptor.get.dependencies = oldGetter.dependencies.concat([computedProperty(name)]);
    }
}

function computedProperty(name) {
    return '_ab_' + name;
}

function memoize(name, getter) {
    const dependencies = getter.dependencies.slice();
    return function() {
        if (!this._memoizedGettersData) {
            this._memoizedGettersData = {};
        }

        if (!this._memoizedGettersData[name]) {
            this._memoizedGettersData[name] = {
                dependencyValuesMap: {}
            };
        }

        const data = this._memoizedGettersData[name];

        const dependenciesAreDifferent = dependencies.reduce((result, dep) => {
            return result || _get(this, dep) !== data.dependencyValuesMap[dep];
        }, false);

        if (!data.hasOwnProperty('lastGetterValue') || dependenciesAreDifferent) {
            dependencies.forEach(dep => {
                data.dependencyValuesMap[dep] = _get(this, dep);
            });

            data.lastGetterValue = getter.call(this);
        }

        return data.lastGetterValue;
    }
}
