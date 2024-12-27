import {differenceInDays} from "date-fns";
import createGoogleApiClient from "./googleApiClient.ts";
import {SpreadsheetExporter} from "../../ports.ts";
import createSdkGoogleAccessTokenClient from "./authorization/sdkGoogleAccessTokenClient.ts";
import createSessionStorageGoogleAccessTokenClient from "./authorization/sessionStorageGoogleAccessTokenClient.ts";
import createApiClientAuthorizer, {ApiClientAuthorizer} from "./authorization/apiClientAuthorizer.ts";

function toGoogleSheetsDate(date: Date) {
    return differenceInDays(date, new Date(1899, 12, 30));
}

function tableToRowData(table: (string | Date)[][]) {
    return table.map(row => ({
        values: row.map(cellValue => ({
            userEnteredValue: cellValue instanceof Date ?
                {numberValue: toGoogleSheetsDate(cellValue)} :
                {stringValue: cellValue}
        }))
    }));
}

function createSpreadsheetExporter({apiKey, authClientId}: { apiKey: string, authClientId: string }) {
    let apiClientAuthorizer: ApiClientAuthorizer | undefined;

    const spreadsheetExporter: SpreadsheetExporter = {
        exportSpreadsheet: async ({title, table}: { title: string, table: (string | Date)[][] }) => {
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
                        sheets: [{data: [{startRow: 0, startColumn: 0, rowData: tableToRowData(table)}]}]
                    }
                });

                const spreadsheet = createResponse.result;

                apiClient.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: spreadsheet.spreadsheetId!,
                    resource: {
                        requests: [
                            {
                                repeatCell: {
                                    range: {
                                        sheetId: spreadsheet.sheets![0].properties!.sheetId,
                                        startColumnIndex: 0,
                                        endColumnIndex: 1
                                    },
                                    cell: {userEnteredFormat: {numberFormat: {type: "DATE"}}},
                                    fields: "userEnteredFormat.numberFormat"
                                }
                            }]
                    }
                })

                return spreadsheet.spreadsheetUrl!;
            });

            return {spreadsheetUrl};
        }
    };

    return spreadsheetExporter;
}

export default createSpreadsheetExporter;