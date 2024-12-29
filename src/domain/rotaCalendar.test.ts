import {beforeEach, expect, test} from 'vitest';
import createRotaCalendar, {RotaCalendar} from "./rotaCalendar.ts";

let rotaCalendar: RotaCalendar, currentTime: Date;

beforeEach(() => {
    currentTime = new Date();
    const clock = {getCurrentTime: () => currentTime};
    rotaCalendar = createRotaCalendar(clock);
});

test("starts rota on current year's first Monday in April when current time is before April", () => {
    currentTime = localDate(2025, 2, 15);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
});

test("starts rota on next year's first Monday in April when current time is after April", () => {
    currentTime = localDate(2025, 5, 15);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2026, 4, 6));
});

test("starts rota on current year's first Monday in April when current time is in April, before first Monday", () => {
    currentTime = localDate(2025, 4, 6);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
});

test("starts rota on next year's first Monday in April when current time is in April, after first Monday", () => {
    currentTime = localDate(2025, 4, 8);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2026, 4, 6));
});

test("starts rota on next year's first Monday in April when current time is first Monday in April", () => {
    currentTime = localDate(2025, 4, 7);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2026, 4, 6));
});

test("starts rota on next year's first Monday in April when current time is both the first day, and the first Monday, in April", () => {
    currentTime = localDate(2024, 4, 1);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
});

test("starts rota on current year's first Monday in April when current time is one second before first Monday in April", () => {
    currentTime = localDate(2025, 4, 6, 23, 59, 59);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
});

test("provides date of each monday in order from start of rota", () => {
    currentTime = localDate(2025, 1, 1);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
    expect(rotaMondays[1]).toEqual(localDate(2025, 4, 14));
    expect(rotaMondays[2]).toEqual(localDate(2025, 4, 21));
    expect(rotaMondays[3]).toEqual(localDate(2025, 4, 28));
});

test("provides one year of dates", () => {
    currentTime = localDate(2025, 1, 1);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays).toHaveLength(52);
    expect(rotaMondays[0]).toEqual(localDate(2025, 4, 7));
    expect(rotaMondays[rotaMondays.length - 1]).toEqual(localDate(2026, 3, 30));
});

test("provides 53 mondays when there are 53 mondays in the rota year", () => {
    currentTime = localDate(2024, 3, 31);
    const rotaMondays = rotaCalendar.getRotaMondays();
    expect(rotaMondays).toHaveLength(53);
    expect(rotaMondays[0]).toEqual(localDate(2024, 4, 1));
    expect(rotaMondays[rotaMondays.length - 1]).toEqual(localDate(2025, 3, 31));
});

function localDate(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0) {
    return new Date(year, month - 1, day, hour, minute, second);
}