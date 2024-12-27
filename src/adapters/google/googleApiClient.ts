export type GAPIClient = typeof gapi.client;

function createGoogleApiClient({apiKey, discoveryDocs}: {
    apiKey: string,
    discoveryDocs: string[]
}): Promise<GAPIClient> {
    return new Promise((resolve, reject) => {
            gapi.load('client', {
                callback: async function () {
                    // Treat the gapi.client namespace like a client instance, to minimise the direct use of global static references
                    const apiClient = gapi.client;
                    await apiClient.init({apiKey: apiKey, discoveryDocs});
                    resolve(apiClient);
                },
                onerror: reject
            });
        }
    );
}

export default createGoogleApiClient;