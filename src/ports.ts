export type ExportSpreadsheetFunction = ({title, table}: { title: string, table: (string | Date)[][] }) => Promise<{
    spreadsheetUrl: string
}>;

export interface SpreadsheetExporter {
    exportSpreadsheet: ExportSpreadsheetFunction
}

export type GenerateRotaTableFunction = () => (Date | string)[][];