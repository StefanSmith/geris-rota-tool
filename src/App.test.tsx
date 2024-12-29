import {expect, test, vi} from 'vitest';
import {render, screen, waitFor} from "@testing-library/react";
import App from "./App.tsx";
import {ExportRotaResult, RotaSpreadsheetExporter} from "./domain/rotaSpreadsheetExporter.ts";
import {RotaTableGenerator} from "./domain/rotaTableGenerator.ts";
import userEvent from "@testing-library/user-event";
import {aRotaTable} from "./testSupport/builders/rotaTable.ts";
import {controllablePromise, hangingPromise} from "./testSupport/promiseUtils.ts";

/**
 * @vitest-environment jsdom
 */

const ANY_EXPORT_ROTA_RESULT = {spreadsheetUrl: 'http://any-url'};

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

test('initially hides spinner', async () => {
    render(<App
        rotaTableGenerator={mockRotaTableGenerator()}
        rotaSpreadsheetExporter={mockRotaSpreadsheetExporter()}
    />);

    expect(screen.queryByAltText('Spinner')).not.toBeInTheDocument();
});

test('initially hides rota link', async () => {
    render(<App
        rotaTableGenerator={mockRotaTableGenerator()}
        rotaSpreadsheetExporter={mockRotaSpreadsheetExporter()}
    />);

    expect(screen.queryByRole('link', {name: 'Open rota'})).not.toBeInTheDocument();
});

test('initially displays export rota button', async () => {
    render(<App
        rotaTableGenerator={mockRotaTableGenerator()}
        rotaSpreadsheetExporter={mockRotaSpreadsheetExporter()}
    />);

    expect(screen.queryByRole('button', {name: 'Export Rota'})).toBeInTheDocument();
});

test('hides export rota button when clicked', async () => {
    const rotaSpreadsheetExporter = mockRotaSpreadsheetExporter();
    rotaSpreadsheetExporter.exportRota.mockImplementation(() => hangingPromise());

    render(<App
        rotaTableGenerator={mockRotaTableGenerator()}
        rotaSpreadsheetExporter={rotaSpreadsheetExporter}
    />);

    await userEvent.click(screen.getByRole('button', {name: 'Export Rota'}));

    expect(screen.queryByRole('button', {name: 'Export Rota'})).not.toBeInTheDocument();
});

test('displays spinner when export rota button clicked', async () => {
    const rotaSpreadsheetExporter = mockRotaSpreadsheetExporter();
    rotaSpreadsheetExporter.exportRota.mockImplementation(() => hangingPromise());

    render(<App
        rotaTableGenerator={mockRotaTableGenerator()}
        rotaSpreadsheetExporter={rotaSpreadsheetExporter}
    />);

    await userEvent.click(screen.getByRole('button', {name: 'Export Rota'}));

    expect(screen.queryByAltText('Spinner')).toBeInTheDocument();
});

test('generates and exports rota when rota button clicked', async () => {
    const rotaTableGenerator = mockRotaTableGenerator();
    const generatedRotaTable = aRotaTable()
        .withWeekRows([new Date(2025, 3, 7), '', ''])
        .build();
    rotaTableGenerator.generateRotaTable.mockImplementation(() => generatedRotaTable);
    const rotaSpreadsheetExporter = mockRotaSpreadsheetExporter();
    rotaSpreadsheetExporter.exportRota.mockImplementation(() => Promise.resolve(ANY_EXPORT_ROTA_RESULT))

    render(<App
        rotaTableGenerator={rotaTableGenerator}
        rotaSpreadsheetExporter={rotaSpreadsheetExporter}
    />);

    await userEvent.click(screen.getByRole('button', {name: 'Export Rota'}));
    expect(rotaSpreadsheetExporter.exportRota).toHaveBeenCalledWith(generatedRotaTable);
});

test('displays export rota button after rota exported', async () => {
    const rotaSpreadsheetExporter = mockRotaSpreadsheetExporter();
    const exportRotaPromise = controllablePromise<ExportRotaResult>();
    rotaSpreadsheetExporter.exportRota.mockImplementation(() => exportRotaPromise);

    render(<App
        rotaTableGenerator={mockRotaTableGenerator()}
        rotaSpreadsheetExporter={rotaSpreadsheetExporter}
    />);

    await userEvent.click(screen.getByRole('button', {name: 'Export Rota'}));

    exportRotaPromise.resolve(ANY_EXPORT_ROTA_RESULT);

    await waitFor(() => expect(screen.queryByRole('button', {name: 'Export Rota'})).toBeInTheDocument());
});

test('hides spinner after rota exported', async () => {
    const rotaSpreadsheetExporter = mockRotaSpreadsheetExporter();
    const exportRotaPromise = controllablePromise<ExportRotaResult>();
    rotaSpreadsheetExporter.exportRota.mockImplementation(() => exportRotaPromise);

    render(<App
        rotaTableGenerator={mockRotaTableGenerator()}
        rotaSpreadsheetExporter={rotaSpreadsheetExporter}
    />);

    await userEvent.click(screen.getByRole('button', {name: 'Export Rota'}));

    exportRotaPromise.resolve(ANY_EXPORT_ROTA_RESULT);

    await waitFor(() => expect(screen.queryByAltText('Spinner')).not.toBeInTheDocument());
});

test('displays spreadsheet link after rota exported', async () => {
    const rotaSpreadsheetExporter = mockRotaSpreadsheetExporter();
    const exportRotaPromise = controllablePromise<ExportRotaResult>();
    rotaSpreadsheetExporter.exportRota.mockImplementation(() => exportRotaPromise);

    render(<App
        rotaTableGenerator={mockRotaTableGenerator()}
        rotaSpreadsheetExporter={rotaSpreadsheetExporter}
    />);

    await userEvent.click(screen.getByRole('button', {name: 'Export Rota'}));

    exportRotaPromise.resolve({spreadsheetUrl: 'http://the-spreadsheet-url'});

    await waitFor(() => expect(screen.queryByRole('link', {name: 'Open rota'})).toBeInTheDocument());

    const openRotaLink = screen.getByRole("link", {name: "Open rota"});
    expect(openRotaLink).toHaveAttribute("href", "http://the-spreadsheet-url");
    expect(openRotaLink).toHaveAttribute("target", "_blank");
});