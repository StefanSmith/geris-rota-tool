export interface GoogleAccessTokenClient {
    getAccessToken: (scope: string, forceNewToken: boolean) => Promise<string>
}