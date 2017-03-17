/**
 * Created by istrauss on 1/4/2017.
 */

export default class ActionTypeHelper {
    static createNamespace(actionTypeArr, namespacePrefix) {
        return actionTypeArr.reduce((_namespace, actionType) => {
            _namespace[actionType] = namespacePrefix + '_' + actionType;
            return _namespace;
        }, {});
    }
}
