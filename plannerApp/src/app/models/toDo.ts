import { ToDoItem } from './toDoItem';

export class ToDo {
    id: string;
    title: string;
    description: string;
    createdDate: Date;
    startDate: Date;    // Date with earliest ToDoItem - by default it will be today's date
    endDate: Date;      // Date with last ToDoItem - by default it will be today's date
    listOfItems: ToDoItem[];

    constructor(todoTitle?: string) {
        this.id = '-1';
        if (todoTitle) {
            this.title = todoTitle;
        } else {
            this.title = 'Untitled ToDo';
        }
        this.description = '';
        this.createdDate = new Date();
        this.startDate = new Date();
        this.endDate = new Date();
        this.listOfItems = new Array<ToDoItem>();
    }

}
