/**
 * Created by Ishai on 5/2/2017.
 */

import {transient, inject} from 'aurelia-framework';
import {FormatDateTimeValueConverter} from 'global-resources';

@transient()
@inject(FormatDateTimeValueConverter)
export default class OperationHistorytConfig {

    constructor(formatDateTime) {
        return {
            table: {
                order: [[0, 'desc']],
                columns: [
                    {
                        title: 'Date',
                        data: 'transaction.ledger.closedAt',
                        cellCallback: (cell, rowData) => {
                            cell.empty();
                            cell.html(formatDateTime.toView(rowData.transaction.ledger.closedAt));
                        }
                    },
                    {
                        title: 'Type',
                        data: 'type',
                        render(cellData, type, rowData) {
                            return rowData.type.split('_').map(w => w.slice(0, 1).toUpperCase() + w.slice(1)).join(' ');
                        }
                    },
                    {
                        title: 'Details',
                        data: 'id',
                        orderable: false,
                        cellCallback: (cell, rowData) => {
                            cell.empty();

                            const table = $('<table></table>');
                            const details = rowData.details;

                            Object.keys(details).forEach(key => {
                                table.append($(
                                    '<tr><td style="text-align: right; border-top-width: 0;">' +
                                    key.replace('_', ' ').toUpperCase() +
                                    ':</td><td style="text-align: left; border-top-width: 0; word-break: break-all;">'
                                    + details[key] + '</td></tr>'
                                ))
                            });

                            table.appendTo(cell);
                        }
                    },
                    {
                        title: '',
                        defaultContent: '',
                        searchable: false,
                        orderable: false
                    }
                ]
            }
        };
    }
}
