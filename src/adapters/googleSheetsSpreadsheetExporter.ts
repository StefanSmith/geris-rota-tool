import TokenClient = google.accounts.oauth2.TokenClient;
import TokenResponse = google.accounts.oauth2.TokenResponse;
import {SpreadsheetExporter} from "../ports.ts";
import {differenceInDays} from "date-fns";

export default ({apiKey, authClientId}: { apiKey: string, authClientId: string }) => {
    let gapiClientInitialized = false;
    let tokenClient: TokenClient;

    const spreadsheetExporter: SpreadsheetExporter = {
        exportSpreadsheet: async ({title, table}) => {
            if (!gapiClientInitialized) {
                await new Promise((resolve, reject) => {
                        gapi.load('client', {
                            callback: async function () {
                                await gapi.client.init({
                                    apiKey: apiKey,
                                    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                                });
                                resolve(null);
                            },
                            onerror: reject
                        });
                    }
                );
                gapiClientInitialized = true;
            }

            let resolveTokenRequestPromise: (tokenResponse: TokenResponse) => void;

            let rejectTokenRequestPromise: (tokenResponse: TokenResponse) => void;

            const tokenRequestPromise = new Promise((resolve, reject) => {
                resolveTokenRequestPromise = resolve;
                rejectTokenRequestPromise = reject;
            });

            if (!tokenClient) {
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: authClientId,
                    scope: 'https://www.googleapis.com/auth/spreadsheets',
                    callback: async (resp) => {
                        if (resp.error === undefined) {
                            resolveTokenRequestPromise(resp);
                        }

                        rejectTokenRequestPromise(resp);
                    }
                });

                const serialisedToken = sessionStorage.getItem('googleAccessToken');

                if (serialisedToken) {
                    gapi.client.setToken(JSON.parse(serialisedToken));
                } else {
                    tokenClient.requestAccessToken({prompt: 'consent'});
                    await tokenRequestPromise;
                    sessionStorage.setItem('googleAccessToken', JSON.stringify(gapi.client.getToken()));
                }
            }

            const workToDo = () => {
                return gapi.client.sheets.spreadsheets.create({
                    resource: {
                        properties: {title},
                        sheets: [
                            {
                                data: [
                                    {
                                        startRow: 0,
                                        startColumn: 0,
                                        rowData: table.map(row => ({
                                            values: row.map(cell => ({
                                                userEnteredValue: cell instanceof Date ?
                                                    {numberValue: differenceInDays(cell, new Date(1899, 12, 30))} :
                                                    {stringValue: cell}
                                            }))
                                        }))
                                    }
                                ]
                            }
                        ]
                    }
                })
            };

            let createResponse: gapi.client.Response<gapi.client.sheets.Spreadsheet> | undefined = undefined;

            let failureCount = 0;

            try {
                createResponse = await workToDo();
            }
            catch(e) {
                // @ts-expect-error We cannot anticipate the shape of the error object
                if (e.result.error.code === 401 && failureCount === 0) {
                    failureCount++;
                    tokenClient.requestAccessToken({prompt: 'consent'});
                    await tokenRequestPromise;
                    sessionStorage.setItem('googleAccessToken', JSON.stringify(gapi.client.getToken()));
                    createResponse = await workToDo();
                } else {
                    throw e;
                }
            }

            await gapi.client.sheets.spreadsheets.batchUpdate({
                spreadsheetId: createResponse.result.spreadsheetId!,
                resource: {
                    requests: [
                        {
                            repeatCell: {
                                range: {
                                    sheetId: createResponse.result.sheets![0].properties!.sheetId,
                                    startColumnIndex: 0,
                                    endColumnIndex: 1
                                },
                                cell: {userEnteredFormat: {numberFormat: {type: "DATE"}}},
                                fields: "userEnteredFormat.numberFormat"
                            }
                        }                    ]
                }
            });

            return {spreadsheetUrl: createResponse.result.spreadsheetUrl!};
        }
    };

    return spreadsheetExporter;
};