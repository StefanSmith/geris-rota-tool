export interface Clock {
    getCurrentTime: () => Date
}

export type DataTableCell = string | Date;
export type DataTableRow = DataTableCell[];
export type DataTable = { rows: DataTableRow[], dateColumns: number[] };

export interface SpreadsheetAuthor {
    createSpreadsheet: (title: string, table: DataTable) => Promise<{
        spreadsheetUrl: string
    }>
}