import {actionCreator} from 'au-redux';
import {UPDATE_DISPLAYED_OFFER_TYPE} from '../detail.action-types';

@actionCreator()
export class UpdateDisplayedOfferTypeActionCreator {

    create(newType) {
        return {
            type: UPDATE_DISPLAYED_OFFER_TYPE,
            payload: newType
        }
    }
}
