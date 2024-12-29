import {RotaTable} from "./rotaTableGenerator.ts";

export interface Clock {
    getCurrentTime: () => Date
}

export interface SpreadsheetExporter {
    exportSpreadsheet: (title: string, table: RotaTable) => Promise<{
        spreadsheetUrl: string
    }>
}