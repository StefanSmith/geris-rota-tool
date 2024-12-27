import {GoogleAccessTokenClient} from "./googleAccessTokenClient.ts";

function createSessionStorageGoogleAccessTokenClient(googleAccessTokenClient: GoogleAccessTokenClient): GoogleAccessTokenClient {
    return {
        getAccessToken: async function (scope, forceNewToken) {
            const cacheKey = `googleAccessToken:${scope}`;
            const cachedAccessToken = !forceNewToken && sessionStorage.getItem(cacheKey);

            if (cachedAccessToken) {
                return cachedAccessToken
            }

            const accessToken = await googleAccessTokenClient.getAccessToken(scope, forceNewToken);
            sessionStorage.setItem(cacheKey, accessToken);

            return accessToken;
        }
    };
}

export default createSessionStorageGoogleAccessTokenClient;