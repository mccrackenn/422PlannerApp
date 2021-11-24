export class ToDo {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    notification: boolean;
    createdDate: Date;
    startDateTime: Date;    // User entered Todo Start date & time
    endDateTime: Date;      // User entered Todo End date & time

    constructor() {
        this.id = '';
        this.title = '';
        this.description = '';
        this.completed = false;
        this.notification = false;
        this.createdDate = new Date();
        this.startDateTime = new Date();
        this.endDateTime = new Date();
    }
}
