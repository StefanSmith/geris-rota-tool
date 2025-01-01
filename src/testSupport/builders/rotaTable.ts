import {DataTable, DataTableRow} from "../../domain/types.ts";

export function aRotaTable() {
    let weekRows: DataTableRow[] = [];

    const self = {
        withWeekRows: (...value: DataTableRow[]) => {
            weekRows = value;
            return self;
        },
        build: function (): DataTable {
            return {
                dateColumns: [1],
                rows: [
                    ['Monday', 'CMU A', 'CMU A'],
                    ...weekRows
                ]
            };
        }
    };

    return self;
}