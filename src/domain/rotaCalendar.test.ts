import {beforeEach, expect, test} from 'vitest';
import createRotaCalendar, {RotaCalendar} from "./rotaCalendar.ts";
import {clockFrozenAt, localDate, TestClock} from "../testSupport/dateUtils.ts";

let rotaCalendar: RotaCalendar, clock: TestClock;

beforeEach(() => {
    clock = clockFrozenAt(2025, 1, 15);
    rotaCalendar = createRotaCalendar(clock);
});

test("starts rota on current year's first Monday in April when current time is before April", () => {
    clock.setCurrentDate(2025, 2, 15);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
});

test("starts rota on next year's first Monday in April when current time is after April", () => {
    clock.setCurrentDate(2025, 5, 15);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2026, 4, 6));
});

test("starts rota on current year's first Monday in April when current time is in April, before first Monday", () => {
    clock.setCurrentDate(2025, 4, 6);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
});

test("starts rota on next year's first Monday in April when current time is in April, after first Monday", () => {
    clock.setCurrentDate(2025, 4, 8);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2026, 4, 6));
});

test("starts rota on next year's first Monday in April when current time is first Monday in April", () => {
    clock.setCurrentDate(2025, 4, 7);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2026, 4, 6));
});

test("starts rota on next year's first Monday in April when current time is both the first day, and the first Monday, in April", () => {
    clock.setCurrentDate(2024, 4, 1);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
});

test("starts rota on current year's first Monday in April when current time is one second before first Monday in April", () => {
    clock.setCurrentDateTime(2025, 4, 6, 23, 59, 59);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
});

test("provides date of each monday in order from start of rota", () => {
    clock.setCurrentDate(2025, 1, 1);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
    expect(rotaMondays[1]).toEqual(localDate(2025, 4, 14));
    expect(rotaMondays[2]).toEqual(localDate(2025, 4, 21));
    expect(rotaMondays[3]).toEqual(localDate(2025, 4, 28));
});

test("provides one year of dates", () => {
    clock.setCurrentDate(2025, 1, 1);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays).toHaveLength(52);
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
    expect(rotaMondays[rotaMondays.length - 1]).toEqual(localDate(2026, 3, 30));
});

test("provides 53 mondays when there are 53 mondays in the rota year", () => {
    clock.setCurrentDate(2024, 3, 31);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays).toHaveLength(53);
    expect(rotaMondays[0]).toEqual(localDate(2024, 4, 1));
    expect(rotaMondays[rotaMondays.length - 1]).toEqual(localDate(2025, 3, 31));
});

