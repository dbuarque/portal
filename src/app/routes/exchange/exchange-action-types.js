/**
 * Created by istrauss on 1/7/2017.
 */

import {ActionTypeHelper} from 'utils';

export const namespace = 'EXCHANGE';

export const exchangeActionTypes = ActionTypeHelper.createNamespace(
    [
        'UPDATE_ASSET_PAIR'
    ],
    namespace
);

