import {beforeEach, expect, test} from 'vitest';
import createRotaTableGenerator, {RotaTableGenerator} from "./rotaTableGenerator.ts";

let rotaTableGenerator: RotaTableGenerator, currentTime: Date;

beforeEach(() => {
    currentTime = new Date(Date.UTC(1970, 0, 1));
    const clock = {getCurrentTime: () => currentTime};
    rotaTableGenerator = createRotaTableGenerator(clock);
});

test('defines first column as date-formatted', () => {
    const rotaTable = rotaTableGenerator.generateRotaTable();
    expect(rotaTable.dateColumns).toEqual([0]);
});

test('names the first column "Monday"', () => {
    const rotaTable = rotaTableGenerator.generateRotaTable();
    expect(rotaTable.rows[0][0]).toEqual('Monday');
});

test('includes column for "CMU A" ward', () => {
    const rotaTable = rotaTableGenerator.generateRotaTable();
    expect(rotaTable.rows[0]).toContain('CMU A');
});

test('includes column for "CMU B" ward', () => {
    const rotaTable = rotaTableGenerator.generateRotaTable();
    expect(rotaTable.rows[0]).toContain('CMU B');
});

test("includes row for every Monday in upcoming year's rota", () => {
    currentTime = new Date(2024, 11, 27);

    const rotaTable = rotaTableGenerator.generateRotaTable();

    const weekRows = rotaTable.rows.splice(1);
    expect(weekRows).toHaveLength(52);

    const firstWeekMonday = weekRows[0][0];
    expect(firstWeekMonday).toEqual(new Date(2025, 3, 7));

    const lastWeekMonday = weekRows[weekRows.length - 1][0];
    expect(lastWeekMonday).toEqual(new Date(2026, 2, 30));
});