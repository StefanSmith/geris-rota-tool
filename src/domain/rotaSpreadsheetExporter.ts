import {Clock, SpreadsheetAuthor} from "./ports.ts";
import {DataTable} from "./types.ts";

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