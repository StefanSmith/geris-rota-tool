/**
 * @vitest-environment jsdom
 */
import {DataTable} from "../domain/ports.ts";
import {ExportRotaResult, RotaSpreadsheetExporter} from "../domain/rotaSpreadsheetExporter.ts";
import {promiseThatResolvesAfterMillis} from "./promiseUtils.ts";
import {clockFrozenAt} from "./dateUtils.ts";
import {render, screen} from "@testing-library/react";
import App from "../App.tsx";
import {vi} from "vitest";
import userEvent from "@testing-library/user-event";

function mockRotaSpreadsheetExporter() {
    return {
        exportRota: vi.fn<RotaSpreadsheetExporter['exportRota']>()
    };
}

export interface TestApplicationUI {
    getRotaSpreadsheetLinkUrl(): string | null;

    requestRotaExport: () => Promise<void>;
}

interface RotaSpreadsheetExporting {
    exportsSpreadsheetsToUrl: (handler: (rotaTable: DataTable) => string) => TestApplication;
    exportedRotaTables: () => DataTable[];
}

interface RuntimeEnvironment {
    hasCurrentDate: (year: number, month: number, day: number) => TestApplication;
}

interface TestApplication {
    runtimeEnvironment: RuntimeEnvironment
    rotaSpreadsheetExporting: RotaSpreadsheetExporting
    ui: TestApplicationUI
}

export function createApplication(): TestApplication {
    const rotaSpreadsheetExporter = mockRotaSpreadsheetExporter();

    let handleRotaExportRequested: (rotaTable: DataTable) => string;

    const exportedRotaTables: DataTable[] = [];

    rotaSpreadsheetExporter.exportRota.mockImplementation(rotaTable => {
        exportedRotaTables.push(rotaTable);

        const resolvedValue: ExportRotaResult = {
            spreadsheetUrl: handleRotaExportRequested ?
                handleRotaExportRequested(rotaTable) :
                'http://default-spreadsheet-url'
        };

        return promiseThatResolvesAfterMillis(100, resolvedValue);
    });

    const clock = clockFrozenAt(1970, 1, 1);

    render(<App
        rotaSpreadsheetExporter={rotaSpreadsheetExporter}
        clock={clock}
    />);

    const testApplication: TestApplication = {
        runtimeEnvironment: {
            hasCurrentDate(year: number, month: number, day: number) {
                clock.setCurrentDate(year, month, day);
                return testApplication;
            }
        },
        rotaSpreadsheetExporting: {
            exportsSpreadsheetsToUrl: function (handler: (rotaTable: DataTable) => string) {
                handleRotaExportRequested = handler;
                return testApplication;
            },
            exportedRotaTables: function () {
                return [...exportedRotaTables];
            }
        },
        ui: {
            getRotaSpreadsheetLinkUrl(): string | null {
                const openRotaLink = screen.queryByRole("link", {name: "Open rota"});
                return openRotaLink && openRotaLink.getAttribute("href");
            },
            requestRotaExport: async function () {
                await userEvent.click(screen.getByText('Export Rota'));
            }
        }
    };

    return testApplication;
}