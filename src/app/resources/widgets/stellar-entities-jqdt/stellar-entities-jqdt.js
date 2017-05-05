/**
 * Created by istrauss on 5/1/2017.
 */
    
import {inject, bindable} from 'aurelia-framework';

export class StellarEntitiesJqdt {

    @bindable config = {};
    @bindable callBuilder;

    pageNum = 1;

    bind() {
        this._config = {
            ...this.config,
            ...{
                rowId: 'id',
                serverSide: true,
                ajax: this.getPage.bind(this),
                searching: false,
                ordering: false,
                dom: 'rtp',
                pagingType: 'simple',
                pageLength: this.config.pageLength === 100 ? this.config.pageLength : 10
            }
        };
    }

    callBuilderChanged() {
        this.refresh();
    }

    refresh() {
        this.page = undefined;
        this.pageNum = 1;

        if (this.jqueryDataTable && this.callBuilder) {
            this.jqueryDataTable.dataTable.api().ajax.reload();
        }
    }

    async getPage(data, callback, settings) {
        if (!this.page) {
            this.callBuilder.limit(data.length);
            this.page = await this.callBuilder.call();
        }
        else {
            const newPageNum = data.start / data.length + 1;
            this.page = await this.page[newPageNum > this.pageNum ? 'next' : 'previous']();
            this.pageNum = newPageNum;
        }

        callback({
            draw: data.draw,
            recordsTotal: this.page.records === data.length ? (this.pageNum + 1) * data.length : (this.pageNum) * data.length,
            recordsFiltered: this.page.records === data.length ? (this.pageNum + 1) * data.length : (this.pageNum) * data.length,
            data: this.page.records
        });
    }
}
