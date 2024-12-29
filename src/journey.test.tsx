import {expect, test, vi} from 'vitest';
import {render, screen} from "@testing-library/react";
import App from "./App.tsx";
import {RotaSpreadsheetExporter} from "./domain/rotaSpreadsheetExporter.ts";
import {RotaTableGenerator} from "./domain/rotaTableGenerator.ts";
import userEvent from "@testing-library/user-event";
import {aRotaTable} from "./testSupport/builders/rotaTable.ts";
import {DataTable} from "./domain/ports.ts";

/**
 * @vitest-environment jsdom
 */

function mockRotaTableGenerator() {
    return {
        generateRotaTable: vi.fn<RotaTableGenerator['generateRotaTable']>()
    };
}

function mockRotaSpreadsheetExporter() {
    return {
        exportRota: vi.fn<RotaSpreadsheetExporter['exportRota']>()
    };
}

function rotaTableGeneratorThatGenerates(generatedRotaTable: DataTable) {
    const rotaTableGenerator = mockRotaTableGenerator();
    rotaTableGenerator.generateRotaTable.mockImplementation(() => generatedRotaTable);
    return rotaTableGenerator;
}

function rotaSpreadsheetExporterThatExpects(generatedRotaTable: DataTable) {
    const rotaSpreadsheetExporter = mockRotaSpreadsheetExporter();
    rotaSpreadsheetExporter.exportRota.mockImplementation(rotaTable =>
        rotaTable === generatedRotaTable ?
            Promise.resolve({spreadsheetUrl: 'http://spreadsheet-url'}) :
            Promise.reject('Unexpected rota table passed')
    );
    return rotaSpreadsheetExporter;
}

test('Generating a rota', async () => {
    const generatedRotaTable = aRotaTable()
        .withWeekRows([new Date(2025, 3, 7), '', ''])
        .build();

    const rotaTableGenerator = rotaTableGeneratorThatGenerates(generatedRotaTable);
    const rotaSpreadsheetExporter = rotaSpreadsheetExporterThatExpects(generatedRotaTable);

    render(<App
        rotaTableGenerator={rotaTableGenerator}
        rotaSpreadsheetExporter={rotaSpreadsheetExporter}
    />);

    await userEvent.click(screen.getByText('Export Rota'));

    const openRotaLink = await screen.findByRole("link", {name: "Open rota"});
    expect(openRotaLink).toHaveAttribute("href", "http://spreadsheet-url");
});