/**
 * Created by istrauss on 3/17/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {AssetResource} from 'app-resources';

@transient()
@inject(AssetResource)
export default class AssetConfig {
    constructor(assetResource) {
        return {
            codeSelect: {
                idProp: 'value',
                textProp: 'label',
                placeholder: 'Select Code',
                placeholderValue: null,
                allowClear: true,
                minimumInputLength: 1,
                ajax: {
                    delay: 250,
                    cache: true,
                    transport(params, success, failure) {
                        assetResource.codeMatch(params.data.term)
                            .then(codes => {
                                success({
                                    results: codes.map(c => {
                                        return {
                                            label: c,
                                            value: c
                                        }
                                    })
                                })
                            })
                            .catch(err => {
                                failure(err);
                            });
                    }
                },
                getText: c => c.label
            },
            issuerSelect: {
                idProp: 'accountid',
                placeholder: 'Select Issuer',
                placeholderValue: null,
                allowClear: true,
                getText: i => {
                    const domain = i.homedomain ? '<span class="primary-text" style="font-size: 20px;">' + i.homedomain + '</span>' : '<span class="accent-text" style="font-size: 20px;">unknown</span>';
                    return domain + '<br>' + '<span class="accent-text">' + i.accountid + '</span>';
                },
                escapeMarkup: m => m
            }
        };
    }
}
