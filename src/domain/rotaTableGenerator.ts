import createRotaCalendar from "./rotaCalendar.ts";
import {Clock} from "./ports.ts";
import {DataTable, DataTableRow, Doctor} from "./types.ts";

export interface RotaTableGenerator {
    generateRotaTable({doctors}: { doctors: Doctor[] }): DataTable
}

function createRotaTableGenerator(clock: Clock): RotaTableGenerator {
    const rotaCalendar = createRotaCalendar(clock);

    return {
        generateRotaTable({doctors}): DataTable {
            const headerRow: DataTableRow = ['Monday', 'CMU A', 'CMU A'];
            const mondays = rotaCalendar.getRotaMondays();
            const firstDoctorInitials = doctors[0].initials;
            const weekRows: DataTableRow[] = mondays.map(monday => [monday, firstDoctorInitials, firstDoctorInitials]);

            return {
                rows: [headerRow, ...weekRows],
                dateColumns: [0]
            };
        }
    };
}

export default createRotaTableGenerator;

export type GenerateRotaTableFunction = () => DataTable;