import { ToDoItem } from './ToDoItem';

export interface ToDo {
    id: number;
    title: string;
    createdDate: Date;
    startDate: Date;
    endDate: Date;
    listOfItems: ToDoItem[];
}