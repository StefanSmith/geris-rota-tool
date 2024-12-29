export interface Clock {
    getCurrentTime: () => Date
}

export type DataTableCell = string | Date;
export type DataTableRow = DataTableCell[];
export type DataTable = { rows: DataTableRow[], dateColumns: number[] };

type CreateSpreadsheetResult = {
    spreadsheetUrl: string
};

export interface SpreadsheetAuthor {
    createSpreadsheet: (title: string, table: DataTable) => Promise<CreateSpreadsheetResult>
}