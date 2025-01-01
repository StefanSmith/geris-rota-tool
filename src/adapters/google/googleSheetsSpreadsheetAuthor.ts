import {differenceInDays} from "date-fns";
import createGoogleApiClient from "./googleApiClient.ts";
import createSdkGoogleAccessTokenClient from "./authorization/sdkGoogleAccessTokenClient.ts";
import createSessionStorageGoogleAccessTokenClient from "./authorization/sessionStorageGoogleAccessTokenClient.ts";
import createApiClientAuthorizer, {ApiClientAuthorizer} from "./authorization/apiClientAuthorizer.ts";
import {SpreadsheetAuthor} from "../../domain/ports.ts";
import {DataTableRow} from "../../domain/types.ts";

function toGoogleSheetsDate(date: Date): number {
    return differenceInDays(date, new Date(1899, 11, 30));
}

function rowsToSheetsRowData(rows: DataTableRow[]): gapi.client.sheets.RowData[] {
    return rows.map(row => ({
        values: row.map(cellValue => ({
            userEnteredValue: cellValue instanceof Date ?
                {numberValue: toGoogleSheetsDate(cellValue)} :
                {stringValue: cellValue}
        }))
    }));
}

function createSpreadsheetAuthor({apiKey, authClientId}: { apiKey: string, authClientId: string }): SpreadsheetAuthor {
    let apiClientAuthorizer: ApiClientAuthorizer | undefined;

    return {
        createSpreadsheet: async (title, table) => {
            if (!apiClientAuthorizer) {
                apiClientAuthorizer = createApiClientAuthorizer(
                    {
                        scope: 'https://www.googleapis.com/auth/spreadsheets',
                        apiClient: await createGoogleApiClient({
                            apiKey,
                            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
                        }),
                        googleAccessTokenClient: createSessionStorageGoogleAccessTokenClient(createSdkGoogleAccessTokenClient(authClientId))
                    }
                );
            }

            const spreadsheetUrl = await apiClientAuthorizer.withValidAccessToken(async (apiClient) => {
                const createResponse = await apiClient.sheets.spreadsheets.create({
                    resource: {
                        properties: {title},
                        sheets: [{data: [{startRow: 0, startColumn: 0, rowData: rowsToSheetsRowData(table.rows)}]}]
                    }
                });

                const spreadsheet = createResponse.result;

                await apiClient.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: spreadsheet.spreadsheetId!,
                    resource: {
                        requests:
                            table.dateColumns.map(dateColumnIndex => ({
                                repeatCell: {
                                    range: {
                                        sheetId: spreadsheet.sheets![0].properties!.sheetId,
                                        startColumnIndex: dateColumnIndex,
                                        endColumnIndex: dateColumnIndex + 1
                                    },
                                    cell: {userEnteredFormat: {numberFormat: {type: "DATE"}}},
                                    fields: "userEnteredFormat.numberFormat"
                                }
                            }))

                    }
                })

                return spreadsheet.spreadsheetUrl!;
            });

            return {spreadsheetUrl};
        }
    };
}

export default createSpreadsheetAuthor;