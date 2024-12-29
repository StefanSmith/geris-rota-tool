import {expect, test, vi} from 'vitest';
import {createRotaSpreadsheetExporter} from "./rotaSpreadsheetExporter.ts";
import {Clock, SpreadsheetAuthor} from "./ports.ts";
import {aRotaTable} from "../testSupport/builders/rotaTable.ts";

const ANY_CLOCK = {
    getCurrentTime: () => new Date(2024, 11, 29, 16, 47, 31)
};
const ANY_ROTA_TABLE = aRotaTable()
    .build();

test('creates spreadsheet from rota table', () => {
    const spreadsheetAuthor: SpreadsheetAuthor = {
        createSpreadsheet: vi.fn()
    };
    const rotaSpreadsheetExporter = createRotaSpreadsheetExporter(spreadsheetAuthor, ANY_CLOCK);

    const rotaTable = aRotaTable()
        .withWeekRows([
            [new Date(2025, 3, 7), '', ''],
            [new Date(2025, 3, 14), '', ''],
        ])
        .build();

    rotaSpreadsheetExporter.exportRota(rotaTable);

    expect(spreadsheetAuthor.createSpreadsheet).toHaveBeenCalledWith(expect.any(String), rotaTable)
});

test('titles spreadsheet based on current time', () => {
    const spreadsheetAuthor: SpreadsheetAuthor = {
        createSpreadsheet: vi.fn()
    };
    const clock: Clock = {
        getCurrentTime: () => new Date(2024, 6, 29, 16, 47, 31)
    };

    const rotaSpreadsheetExporter = createRotaSpreadsheetExporter(spreadsheetAuthor, clock);

    rotaSpreadsheetExporter.exportRota(ANY_ROTA_TABLE);

    expect(spreadsheetAuthor.createSpreadsheet).toHaveBeenCalledWith(`Geris Rota (generated 2024-07-29T15:47:31.000Z)`, expect.anything())
});