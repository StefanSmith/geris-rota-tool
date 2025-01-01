import {beforeEach, expect, test} from 'vitest';
import createRotaTableGenerator, {RotaTableGenerator} from "./rotaTableGenerator.ts";
import {clockFrozenAt, TestClock} from "../testSupport/dateUtils.ts";

/**
 * @vitest-environment jsdom
 */

const ANY_OPTIONS = {doctors: [{initials: 'XX'}]};

let rotaTableGenerator: RotaTableGenerator, clock: TestClock;

beforeEach(() => {
    clock = clockFrozenAt(1970, 1, 1);
    rotaTableGenerator = createRotaTableGenerator(clock);
});

test('defines first column as date-formatted', () => {
    const rotaTable = rotaTableGenerator.generateRotaTable(ANY_OPTIONS);
    expect(rotaTable.dateColumns).toEqual([0]);
});

test('names the first column "Monday"', () => {
    const rotaTable = rotaTableGenerator.generateRotaTable(ANY_OPTIONS);
    expect(rotaTable.rows[0][0]).toEqual('Monday');
});

test('includes 2 columns for "CMU A" ward', () => {
    const rotaTable = rotaTableGenerator.generateRotaTable(ANY_OPTIONS);
    expect(rotaTable.rows[0].filter(cellValue => cellValue === 'CMU A')).toHaveLength(2);
});

test("includes row for every Monday in upcoming year's rota", () => {
    clock.setCurrentDate(2024, 12, 27);

    const rotaTable = rotaTableGenerator.generateRotaTable(ANY_OPTIONS);

    const weekRows = rotaTable.rows.splice(1);
    expect(weekRows).toHaveLength(52);

    const firstWeekMonday = weekRows[0][0];
    expect(firstWeekMonday).toEqual(new Date(2025, 3, 7));

    const lastWeekMonday = weekRows[weekRows.length - 1][0];
    expect(lastWeekMonday).toEqual(new Date(2026, 2, 30));
});

test("adds first specified doctor to every ward slot", () => {
    const rotaTable = rotaTableGenerator.generateRotaTable({doctors: [{initials: 'DL'}]});

    const weekRows = rotaTable.rows.splice(1);
    expect(weekRows).toHaveLength(52);

    const firstWeekRow = weekRows[0];
    expect(firstWeekRow[1]).toEqual('DL');
    expect(firstWeekRow[2]).toEqual('DL');

    const lastWeekRow = weekRows[weekRows.length - 1];
    expect(lastWeekRow[1]).toEqual('DL');
    expect(lastWeekRow[2]).toEqual('DL');
});