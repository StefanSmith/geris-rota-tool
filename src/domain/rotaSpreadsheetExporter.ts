import {Clock, DataTable, SpreadsheetAuthor} from "./ports.ts";

export interface RotaSpreadsheetExporter {
    exportRota: (rotaTable: DataTable) => Promise<{ spreadsheetUrl: string }>
}

export function createRotaSpreadsheetExporter(spreadsheetAuthor: SpreadsheetAuthor, clock: Clock): RotaSpreadsheetExporter {
    return {
        exportRota: (rotaTable: DataTable) => spreadsheetAuthor.createSpreadsheet(
            `Geris Rota (generated ${clock.getCurrentTime().toISOString()})`,
            rotaTable
        )
    };
}