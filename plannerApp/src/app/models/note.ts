export class Note {
    id: number;
    title: string;
    description: string;
    createdDate: Date;
    startDate: Date;
    endDate: Date;

    constructor() {
        this.id = -1;
        this.title = '';
        this.description = '';
        this.createdDate = new Date();
        this.startDate = new Date();
        this.endDate = new Date();
    }
}
