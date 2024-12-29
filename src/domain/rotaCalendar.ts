import {addWeeks, nextMonday} from "date-fns";
import {Clock} from "./ports.ts";

function getFirstMondayOfRotaStartingAfter(today: Date) {
    const firstMondayInAprilInCurrentYear = nextMonday(new Date(today.getFullYear(), 2, 31));
    const todayIsAfterFirstMondayInApril = today >= firstMondayInAprilInCurrentYear;

    const rotaYear = today.getFullYear() + (todayIsAfterFirstMondayInApril ? 1 : 0);
    return nextMonday(new Date(rotaYear, 2, 31));
}

export interface RotaCalendar {
    getRotaMondays: () => Date[]
}


function createRotaCalendar(clock: Clock): RotaCalendar {
    return {
        getRotaMondays: function () {
            const today = clock.getCurrentTime();

            const firstMondayOfRota = getFirstMondayOfRotaStartingAfter(today);
            const firstMondayOfNextRota = getFirstMondayOfRotaStartingAfter(firstMondayOfRota);

            let monday = firstMondayOfRota;

            const mondays = [];

            while (monday < firstMondayOfNextRota) {
                mondays.push(monday);
                monday = addWeeks(monday, 1);
            }

            return mondays;
        }
    };
}

export default createRotaCalendar;