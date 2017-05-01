/**
 * Created by istrauss on 3/23/2016.
 */

import {AlertModalService} from 'global-resources';

export default class BaseResource {
    constructor(container, config) {
        this.config = config;
    }

    get(action, query, options = {}) {
        options.query = query;
        return this.sendAjax(action, {}, options);
    }

    //getDataTable(data, settings, additionalFilters) {
    //    let query = {
    //        offset: data.start,
    //        limit: data.length,
    //        order: data.columns[data.order[0].column].data + ':' + data.order[0].dir
    //    };
//
    //    data.columns.forEach(column => {
    //        if (column.searchable && column.search.value) {
    //            query[column.data] = 'like:' + '%' + column.search.value + '%';
    //        }
    //    });
//
    //    Object.assign(query, additionalFilters);
//
    //    return this.findAndCount(query)
    //        .then(results => {
    //            return {
    //                draw: data.draw,
    //                recordsTotal: results.count,
    //                recordsFiltered: results.count,
    //                data: results.rows
    //            };
    //        })
    //        .catch(err => {
    //            return {
    //                error: err.message
    //            };
    //        });
    //}

    post(action, query, body, options = {}) {
        options.query = query;
        return this.sendAjax(action, {
            method: 'post',
            body
        }, options);
    }

    sendAjax(action, fetchParams, options = {}) {
        const client = options.client || this.config.client;
        return client.sendAjax((this.config.resourceUrl || '') + (action || ''), fetchParams, options);
    }

    get validationInstructions() {
        throw new Error('getValidationInstructions is not implemented');
    }
}
