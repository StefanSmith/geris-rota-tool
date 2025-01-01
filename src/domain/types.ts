export type Doctor = { initials: string };

export type DataTableCell = string | Date;
export type DataTableRow = DataTableCell[];
export type DataTable = { rows: DataTableRow[], dateColumns: number[] };