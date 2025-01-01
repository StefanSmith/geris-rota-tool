import {expect} from "vitest";
import {TestApplicationUI} from "./openBoxTestApplication.tsx";

expect.extend({
    toDisplayRotaSpreadsheetLinkWithUrl(testApplicationUI: TestApplicationUI, expectedUrl: string) {
        const {isNot} = this;

        const actualUrl = testApplicationUI.getRotaSpreadsheetLinkUrl();

        return {
            pass: actualUrl === expectedUrl,
            message: () => `Expected rota spreadsheet link ${actualUrl} ${isNot ? 'not ' : ''}to be ${expectedUrl}`
        };
    }
});