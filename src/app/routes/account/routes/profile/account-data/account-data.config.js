/**
 * Created by Ishai on 4/27/2017.
 */

import moment from 'moment';
import {transient, inject} from 'aurelia-framework';
import {SanitizeHTMLValueConverter} from 'aurelia-templating-resources';
import {FormatDateTimeValueConverter} from 'global-resources';

@transient()
@inject(FormatDateTimeValueConverter, SanitizeHTMLValueConverter)
export class AccountDataConfig {

    constructor(formatDateTime, sanitizeHTML) {
        return {
            table: {
                lengthMenu: [ 10, 25, 100 ],
                serverSide: true,
                searchDelay: 500,
                columns: [
                    {
                        title: 'Name',
                        data: 'dataName',
                        searchable: true
                    },
                    {
                        title: 'Value',
                        data: 'dataValue',
                        render(cellData, type, rowData) {
                            return atob(rowData.dataValue);
                        },
                        orderable: false
                    },
                    {
                        title: 'LastModified',
                        data: 'ledgerHeader.closeTime',
                        cellCallback (cell, rowData) {
                            cell.empty();
                            let newHtml = formatDateTime.toView(
                                moment.unix(
                                    parseInt(rowData.ledgerHeader.closeTime, 10)
                                )
                            );
                            newHtml = sanitizeHTML.toView(newHtml);
                            cell.html(newHtml);
                        }
                    }
                ]
            }
        };
    }
}

