import createRotaCalendar from "./rotaCalendar.ts";
import {Clock, DataTable, DataTableRow} from "./ports.ts";

export interface RotaTableGenerator {
    generateRotaTable(): DataTable
}

function createRotaTableGenerator(clock: Clock): RotaTableGenerator {
    const rotaCalendar = createRotaCalendar(clock);

    return {
        generateRotaTable(): DataTable {
            const headerRow: DataTableRow = ['Monday', 'CMU A', 'CMU A'];
            const mondays = rotaCalendar.getRotaMondays();
            const weekRows: DataTableRow[] = mondays.map(monday => [monday, '', '']);

            return {
                rows: [headerRow, ...weekRows],
                dateColumns: [0]
            };
        }
    };
}

export default createRotaTableGenerator;

export type GenerateRotaTableFunction = () => DataTable;