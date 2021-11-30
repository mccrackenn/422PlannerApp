export class Preferences {
    userId: number;

    dateZone: string;
    notificationBy: string[];

    showHolidays: boolean;

    lowPriorityNoteColor: string;
    mediumPriorityNoteColor: string;
    highPriorityNoteColor: string;
    todoColor: string;

    constructor() {
        this.userId = -1;
        this.dateZone = '';
        this.notificationBy = ['Email', 'Text'];
        this.showHolidays = false;

        this.lowPriorityNoteColor = 'cyan';
        this.mediumPriorityNoteColor = 'yellow';
        this.highPriorityNoteColor = 'blue';
        this.todoColor = 'green';
    }

}