

export class Note {
    id: string;
    title: string;
    description: string;
    createdDate: Date;
    startDate: Date;
    endDate: Date;

    constructor() {
        this.id = '';
        this.title = '';
        this.description = '';
        this.createdDate = new Date();
        this.startDate = new Date();
        this.endDate = new Date();
    }

}
