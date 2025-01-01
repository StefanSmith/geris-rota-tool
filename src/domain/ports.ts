import {DataTable} from "./types.ts";

export interface Clock {
    getCurrentTime: () => Date
}

type CreateSpreadsheetResult = {
    spreadsheetUrl: string
};

export interface SpreadsheetAuthor {
    createSpreadsheet: (title: string, table: DataTable) => Promise<CreateSpreadsheetResult>
}