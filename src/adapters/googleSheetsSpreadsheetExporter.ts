import TokenClient = google.accounts.oauth2.TokenClient;
import TokenResponse = google.accounts.oauth2.TokenResponse;

export default ({apiKey, authClientId}: { apiKey: string, authClientId: string }) => {
    let gapiClientInitialized = false;
    let tokenClient: TokenClient;

    return {
        exportSpreadsheet: async ({title}: { title: string }) => {
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

            if (!tokenClient) {
                let resolveTokenRequestPromise: (tokenResponse: TokenResponse) => void;
                let rejectTokenRequestPromise: (tokenResponse: TokenResponse) => void;

                const tokenRequestPromise = new Promise((resolve, reject) => {
                    resolveTokenRequestPromise = resolve;
                    rejectTokenRequestPromise = reject;
                });

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

                const requestAccessTokenConfig = {prompt: gapi.client.getToken() === null ? 'consent' : ''};
                tokenClient.requestAccessToken(requestAccessTokenConfig);
                await tokenRequestPromise;
            }

            const response = await gapi.client.sheets.spreadsheets.create({resource: {properties: {title}}});

            return {spreadsheetUrl: response.result.spreadsheetUrl!};
        }
    };
};