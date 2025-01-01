import {Clock} from "../domain/ports.ts";

export function localDate(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0) {
    return new Date(year, month - 1, day, hour, minute, second);
}

export interface TestClock extends Clock {
    setCurrentDate: (year: number, month: number, day: number) => void
    setCurrentDateTime: (year: number, month: number, day: number, hour: number, minute: number, second: number) => void
}

export function clockFrozenAt(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0): TestClock {
    let currentTime: Date;

    const self: TestClock = {
        getCurrentTime: () => currentTime,
        setCurrentDate(year: number, month: number, day: number): void {
            self.setCurrentDateTime(year, month, day, 0, 0, 0);
        },
        setCurrentDateTime(year: number, month: number, day: number, hour: number, minute: number, second: number): void {
            currentTime = localDate(year, month, day, hour, minute, second);
        }
    };

    self.setCurrentDateTime(year, month, day, hour, minute, second);

    return self;
}