import createRotaCalendar from "./rotaCalendar.ts";
import {Clock} from "./ports.ts";

export type RotaTableCell = string | Date;
export type RotaTableRow = RotaTableCell[];
export type RotaTable = { rows: RotaTableRow[], dateColumns: number[] };

export interface RotaTableGenerator {
    generateRotaTable(): RotaTable
}

function createRotaTableGenerator(clock: Clock): RotaTableGenerator {
    const rotaCalendar = createRotaCalendar(clock);

    return {
        generateRotaTable(): RotaTable {
            const headerRow: RotaTableRow = ['Monday', 'CMU A', 'CMU A'];
            const mondays = rotaCalendar.getRotaMondays();
            const weekRows: RotaTableRow[] = mondays.map(monday => [monday, '', '']);

            return {
                rows: [headerRow, ...weekRows],
                dateColumns: [0]
            };
        }
    };
}

export default createRotaTableGenerator;

export type GenerateRotaTableFunction = () => RotaTable;