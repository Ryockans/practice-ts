import './TodoApp';
import { TodoApp } from './TodoApp'
import { MyTodoList } from './TodoList'
import { TodoControl} from "./TodoControl";

const list = new MyTodoList();
const appControl = new TodoControl();
const app = new TodoApp(list);
