export type RotaTableCell = string | Date;
export type RotaTableRow = RotaTableCell[];
export type RotaTable = { rows: RotaTableRow[], dateColumns: number[] };

function createRotaTableGenerator() {
    return {
        generateRotaTable(): RotaTable {
            return {
                rows: [
                    ['Monday', 'CMU A', 'CMU A'],
                    [new Date(2024, 3, 1), '', ''],
                    [new Date(2024, 3, 8), '', ''],
                    [new Date(2024, 3, 15), '', ''],
                ],
                dateColumns: [0]
            };
        }
    };
}

export default createRotaTableGenerator;
export type GenerateRotaTableFunction = () => RotaTable;