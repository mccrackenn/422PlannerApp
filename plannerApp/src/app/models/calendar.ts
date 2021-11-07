import { CalendarItem } from './calendarItem';

export class Calendar {
    calendarItems: Array<CalendarItem>;

    constructor() {
        this.calendarItems = new Array<CalendarItem>();
    }
}
