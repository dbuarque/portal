/**
 * Created by istrauss on 1/7/2017.
 */

import {inject} from 'aurelia-framework';
import {appActionTypes} from './app-action-types';
import {StellarServer} from 'global-resources';
import {BaseOfferService} from './resources/crud/stellar/offer-service/base-offer-service';

const {UPDATE_ACCOUNT, UPDATE_OFFERS} = appActionTypes;

@inject(StellarServer, BaseOfferService)
export class AppActionCreators {
    constructor(stellarServer, offerService) {
        this.stellarServer = stellarServer;
        this.offerService = offerService;
    }

    setAccount(publicKey) {
        return async (dispatch, getState) => {
            if (!publicKey) {
                dispatch({
                    type: UPDATE_ACCOUNT,
                    payload: {
                        account: undefined
                    }
                });
                return;
            }

            let account = getState().account;

            account = account || {id: publicKey};

            dispatch({
                type: UPDATE_ACCOUNT,
                payload: {
                    account: {
                        ...account,
                        updating: true
                    }
                }
            });

            try {
                account = await this.stellarServer.loadAccount(publicKey);
            }
            catch(e) {
                //Couldn't find account, let's logout.
                dispatch(this.setAccount());
                throw e;
            }

            if (account) {
                account.updating = false;
            }

            dispatch({
                type: UPDATE_ACCOUNT,
                payload: {
                    account
                }
            });

            return account;
        };
    }

    updateAccount() {
        return (dispatch, getState) => {
            const account = getState().account;

            if (!account) {
                return;
            }

            return dispatch(this.setAccount(account.id));
        }
    }

    updateOffers(accountId) {
        return async (dispatch, getState) => {
            const offers = await this.offerService.allOffers(accountId);

            return dispatch({
                type: UPDATE_OFFERS,
                payload: offers
            });
        }
    }
}
