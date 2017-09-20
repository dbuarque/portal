/**
 * Created by istrauss on 3/23/2016.
 */

import {Container} from 'aurelia-framework';
import JsonClient from '../clients/json-client';
import {AlertModalService} from 'global-resources';

export default class BaseResource {
    constructor(resourceUrl, config = {}) {
        this.resourceUrl = resourceUrl;
        this.client = config.client || Container.instance.get(JsonClient)
    }

    dataTablePre(data, options = {}) {
        const searchParams = data.columns.reduce((sp, col) => {
            if (
                options.allowedSearchProps &&
                options.allowedSearchProps.indexOf(col.data) > -1
                && col.searchable
                && col.search.value
            ) {
                sp[col.data] = col.search.value;
            }
            return sp;
        }, {});

            
        return {
            ...searchParams,
            offset: data.start,
            limit: data.length,
            order: data.columns[data.order[0].column].data + ':' + data.order[0].dir
        };
    }

    dataTablePost(data, results) {
        return {
            draw: data.draw,
            recordsTotal: results.count,
            recordsFiltered: results.count,
            data: results.rows
        };
    }

    getDataTable(data, settings, additionalFilters) {
        let query = {
            offset: data.start,
            limit: data.length,
            order: data.columns[data.order[0].column].data + ':' + data.order[0].dir
        };

        data.columns.forEach(column => {
            if (column.searchable && column.search.value) {
                if (column.query) {
                    query = column.config.query(query, column.search.value);
                }
                else {
                    query[column.data] = 'like:' + '%' + column.search.value + '%';
                }
            }
        });

        Object.assign(query, additionalFilters);

        return this.findAndCount(query)
            .then(results => {
                return {
                    draw: data.draw,
                    recordsTotal: results.count,
                    recordsFiltered: results.count,
                    data: results.rows
                };
            })
            .catch(err => {
                return {
                    error: err.message
                };
            });
    }

    get(action, query, options = {}) {
        options.query = query;
        return this.sendAjax(action, {}, options);
    }

    post(action, query, body, options = {}) {
        options.query = query;
        return this.sendAjax(action, {
            method: 'post',
            body
        }, options);
    }

    sendAjax(action, fetchParams, options = {}) {
        const client = options.client || this.client;
        return client.sendAjax((this.resourceUrl || '') + (action || ''), fetchParams, options);
    }

    get validationInstructions() {
        throw new Error('getValidationInstructions is not implemented');
    }
}
