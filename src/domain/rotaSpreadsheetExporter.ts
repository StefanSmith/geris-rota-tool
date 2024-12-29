import {Clock, DataTable, SpreadsheetAuthor} from "./ports.ts";

export type ExportRotaResult = { spreadsheetUrl: string };

export interface RotaSpreadsheetExporter {
    exportRota: (rotaTable: DataTable) => Promise<ExportRotaResult>
}

export function createRotaSpreadsheetExporter(spreadsheetAuthor: SpreadsheetAuthor, clock: Clock): RotaSpreadsheetExporter {
    return {
        exportRota: (rotaTable: DataTable) => spreadsheetAuthor.createSpreadsheet(
            `Geris Rota (generated ${clock.getCurrentTime().toISOString()})`,
            rotaTable
        )
    };
}