import {GAPIClient} from "../googleApiClient.ts";
import {GoogleAccessTokenClient} from "./googleAccessTokenClient.ts";

export interface ApiClientAuthorizer {
    withValidAccessToken: <T>(operation: (apiClient: GAPIClient) => T) => Promise<T>
}

function createApiClientAuthorizer({apiClient, scope, googleAccessTokenClient}: {
    apiClient: GAPIClient,
    scope: string,
    googleAccessTokenClient: GoogleAccessTokenClient
}): ApiClientAuthorizer {
    async function executeWithValidAccessToken<T>(operation: (apiClient: GAPIClient) => T, forceNewToken: boolean = false) {
        const accessToken = await googleAccessTokenClient.getAccessToken(scope, forceNewToken);

        // Note: explicitly setting the token is only strictly necessary when the token is retrieved from local
        // cache since the gapi client will automatically use access tokens retrieved by the token client
        apiClient.setToken({access_token: accessToken});

        try {
            return await operation(apiClient);
        } catch (e) {
            // @ts-expect-error We cannot anticipate the shape of the error object
            if (!forceNewToken && e.result.error.code === 401) {
                return executeWithValidAccessToken(operation, true);
            }

            throw e;
        }
    }

    return {
        withValidAccessToken: <T>(operation: (apiClient: GAPIClient) => T) => executeWithValidAccessToken(operation)
    };
}

export default createApiClientAuthorizer;