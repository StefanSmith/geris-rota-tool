import {RotaTable} from "./rotaTableGenerator.ts";

export type ExportSpreadsheetFunction = ({title, table}: {
    title: string,
    table: RotaTable
}) => Promise<{
    spreadsheetUrl: string
}>;

export interface Clock {
    getCurrentTime: () => Date
}

export interface SpreadsheetExporter {
    exportSpreadsheet: ExportSpreadsheetFunction
}