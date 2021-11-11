import { ToDoItem } from './toDoItem';

export class ToDo {
    id: string;
    todoTitle: string;
    createdDate: Date;
    startDate: Date;    // Date with earliest ToDoItem - by default it will be today's date
    endDate: Date;      // Date with last ToDoItem - by default it will be today's date
    listOfItems: ToDoItem[];

    constructor(title?: string) {
        this.id = '-1';
        if (title) {
            this.todoTitle = title;
        } else {
            this.todoTitle = 'Untitled ToDo';
        }
        this.createdDate = new Date();
        this.startDate = new Date();
        this.endDate = new Date();
        this.listOfItems = new Array<ToDoItem>();
    }

}
