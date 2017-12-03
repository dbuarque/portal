import {inject} from 'aurelia-framework';
import {actionCreator} from 'aurelia-redux-connect';
import {AccountResource} from '../resources/crud/resources';
import {UPDATE_MY_ACCOUNT_SEQNUM} from '../app.action-types';

@actionCreator()
@inject(AccountResource)
export class UpdateMySeqnumActionCreator {
    constructor(accountResource) {
        this.accountResource = accountResource;
    }

    create() {
        return async (dispatch, getState) => {
            const state = getState();
            if (!state.myAccount) {
                throw new Error('Cannot update the seqnum without an account in the store.');
            }

            try {
                const data = await this.accountResource.seqnum(state.myAccount.accountId);

                return dispatch({
                    type: UPDATE_MY_ACCOUNT_SEQNUM,
                    payload: data.seqNum
                });
            }
            catch (e) {
                throw e;
            }
        };
    }
}
