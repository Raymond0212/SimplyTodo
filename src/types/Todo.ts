import { TreeItemCheckboxState, TreeItemCollapsibleState } from "vscode";

export interface Todo {
  id: string;
  title: string;
  tags?: string[];
  children: Todo[];
  checkboxState: TreeItemCheckboxState;
  collapsibleState: TreeItemCollapsibleState;
  parent?: string[];
}

export class NewTodo implements Todo {
  id: string;
  title: string = "New todo";
  tags?: string[];
  children: Todo[] = [];
  checkboxState: TreeItemCheckboxState = TreeItemCheckboxState.Unchecked;
  collapsibleState: TreeItemCollapsibleState = TreeItemCollapsibleState.None;
  parent?: string[] = [];

  constructor(id: string, todos: Todo[], parenttodo?: Todo, title?: string, tags?: string[]) {
    this.id = id;
    if (title) {
      this.title = title;
    }
    if (tags) {
      this.tags = tags;
    }
    if (parenttodo) {
      this.parent = parenttodo.parent ? [...parenttodo.parent, parenttodo.id] : [];
      parenttodo.children.push(this);
      if (parenttodo.collapsibleState === TreeItemCollapsibleState.None) {
        parenttodo.collapsibleState = TreeItemCollapsibleState.Expanded;
      }
    } else {
      todos.push(this);
    }
  }
}

export function todoIterator(
  todos: Todo[],
  criteria: (todo: Todo) => boolean,
  callback: (todos: Todo[]) => Todo[]
): Todo[] {
  todos = callback(todos);
  todos.forEach((todo) => {
    if (criteria(todo)) {
      todo.children = todoIterator(todo.children, criteria, callback);
    }
  });
  return todos;
}
