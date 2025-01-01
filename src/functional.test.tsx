import {expect, test} from 'vitest';
import {waitFor} from "@testing-library/react";
import {localDate} from "./testSupport/dateUtils.ts";
import {createApplication} from "./testSupport/openBoxTestApplication.tsx";

/**
 * @vitest-environment jsdom
 */

test('Generating a rota', async () => {
    const app = createApplication()
        .runtimeEnvironment.hasCurrentDate(2025, 1, 15)
        .rotaSpreadsheetExporting.exportsSpreadsheetsToUrl(() => "http://spreadsheet-url");

    await app.ui.requestRotaExport();

    await waitFor(() => expect(app.ui).toDisplayRotaSpreadsheetLinkWithUrl("http://spreadsheet-url"));

    const exportedRotaTables = app.rotaSpreadsheetExporting.exportedRotaTables();
    expect(exportedRotaTables).toHaveLength(1);

    const exportedRotaTable = exportedRotaTables[0];
    expect(exportedRotaTable.rows[0]).toEqual(['Monday', 'CMU A', 'CMU A']);
    expect(exportedRotaTable.rows[1]).toEqual([localDate(2025, 4, 7), '', '']);
    expect(exportedRotaTable.rows[2]).toEqual([localDate(2025, 4, 14), '', '']);
    expect(exportedRotaTable.rows[52]).toEqual([localDate(2026, 3, 30), '', '']);
});