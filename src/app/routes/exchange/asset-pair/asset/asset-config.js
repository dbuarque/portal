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
                            });
                    }
                },
                getText: c => c.label
            },
            issuerSelect: {
                idProp: 'value',
                textProp: 'label',
                placeholder: 'Select Issuer',
                placeholderValue: null,
                allowClear: true,
                getText: i => i.label
            }
        };
    }
}
