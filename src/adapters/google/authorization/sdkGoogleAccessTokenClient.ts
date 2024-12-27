import TokenResponse = google.accounts.oauth2.TokenResponse;

import {GoogleAccessTokenClient} from "./googleAccessTokenClient.ts";

function createSdkGoogleAccessTokenClient(authClientId: string): GoogleAccessTokenClient {
    return {
        getAccessToken: async function (scope: string) {
            let resolveTokenRequestPromise: (tokenResponse: TokenResponse) => void;

            let rejectTokenRequestPromise: (tokenResponse: TokenResponse) => void;

            const tokenRequestPromise = new Promise<TokenResponse>((resolve, reject) => {
                resolveTokenRequestPromise = resolve;
                rejectTokenRequestPromise = reject;
            })

            const tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: authClientId,
                scope,
                callback: async (resp) => {
                    if (resp.error === undefined) {
                        resolveTokenRequestPromise(resp);
                    }

                    rejectTokenRequestPromise(resp);
                }
            });

            tokenClient.requestAccessToken({prompt: 'consent'});
            const tokenResponse = await tokenRequestPromise;

            return tokenResponse.access_token;
        }
    };
}

export default createSdkGoogleAccessTokenClient;