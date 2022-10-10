export interface TodoItem {
  isCompleted: boolean;
  text: string;

  getElement(): HTMLElement;
}

export interface TodoListRenderFilter {
  (item: TodoItem): boolean;
}

export interface TodoList {
  list: TodoItem[];

  addItem(text: string): void;
  render(): void;

  renderFilter?: TodoListRenderFilter;

  changeFilter(filter: TodoListRenderFilter): void;

  clearCompleted():void;
}

export interface TodoControl {
}

export enum TodoEvents {
  New = 'todo:new',
  Create = 'todo:create',
  Change = 'todo:change',
  Filter = 'todo:filter',
  Remove = 'todo:remove',
  ClearDone = 'todo:clear-done',
}

export type Filter = 'all' | 'active' | 'completed';