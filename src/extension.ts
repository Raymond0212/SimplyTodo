import { commands, ExtensionContext, window, TreeItemCollapsibleState } from "vscode";
import { v4 as uuidv4 } from "uuid";
import { TodoTreeDataProvider, TodoTreeItem } from "./providers/TodoTreeDataProvider";
import { NewTodo, Todo } from "./types/Todo";
import { TodoDetailViewProvider } from "./providers/TodoDetaiViewProvider";

function findtodoById(todos: Todo[], id: string): Todo | undefined {
  for (const todo of todos) {
    if (todo.id === id) {
      return todo;
    }
    if (todo.children) {
      const found = findtodoById(todo.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

function findParent(todos: Todo[], parentPath: string[]): Todo | undefined {
  const currentId = parentPath[0];
  for (const todo of todos) {
    if (todo.id === currentId && parentPath.length <= 1) {
      return todo;
    } else if (todo.id === currentId && todo.children) {
      return findParent(todo.children, parentPath.slice(1));
    }
  }
  return undefined;
}

function deleteTreetodo(todos: Todo[], todo: Todo): boolean {
  todos = findParent(todos, todo.parent ? todo.parent : [])?.children || todos;
  const index = todos.findIndex((t) => t.id === todo.id);

  if (index !== -1) {
    todos.splice(index, 1);
    return true;
  }

  return false;
}

export function activate(context: ExtensionContext) {
  const SIMPLY_TODO_STORAGE_KEY = "simply-todo-todo-list";
  let todos: Todo[] = context.globalState.get(SIMPLY_TODO_STORAGE_KEY, []);

  const todoDataProvider = new TodoTreeDataProvider(todos);
  const todoDetailProvider = new TodoDetailViewProvider(context.extensionUri);

  // Create a tree view to contain the list of todo todos
  const treeView = window.createTreeView("simplytodo.todoListView", {
    treeDataProvider: todoDataProvider,
    showCollapseAll: true,
  });

  context.subscriptions.push(
    window.registerWebviewViewProvider("simplytodo.todoDetailView", todoDetailProvider)
  );

  treeView.onDidCollapseElement((e) => {
    const todo = findtodoById(todos, e.element.id!);
    if (todo) {
      todo.collapsibleState = TreeItemCollapsibleState.Collapsed;
      context.globalState.update(SIMPLY_TODO_STORAGE_KEY, todos);
    }
  });

  treeView.onDidExpandElement((e) => {
    const todo = findtodoById(todos, e.element.id!);
    if (todo) {
      todo.collapsibleState = TreeItemCollapsibleState.Expanded;
      context.globalState.update(SIMPLY_TODO_STORAGE_KEY, todos);
    }
  });

  const showTodoDetail = commands.registerCommand(
    "simplytodo.showTodoDetail",
    (todoItem: TodoTreeItem) => {
      const todoToShow = findtodoById(todos, todoItem.id);
      if (todoToShow) {
        todoDetailProvider.refresh(todoToShow);
      }
    }
  );

  const refreshDetail = commands.registerCommand("simplytodo.refreshDetail", () =>
    todoDataProvider.refresh(todos)
  );

  const refreshList = commands.registerCommand("simplytodo.refreshList", () =>
    todoDataProvider.refresh(todos)
  );

  const editItem = commands.registerCommand(
    "simplytodo.editItem",
    async (todoItem: TodoTreeItem) => {
      const newLabel = await window.showInputBox({
        value: todoItem.label?.toString(),
      });

      const todoToEdit = findtodoById(todos, todoItem.id);
      if (todoToEdit) {
        todoToEdit.title = newLabel || todoToEdit.title;
        todoDataProvider.refresh(todos);
      }
    }
  );

  // Command to create a new todo
  const createTodo = commands.registerCommand(
    "simplytodo.createTodo",
    (parentTodo?: TodoTreeItem) => {
      const id = uuidv4();

      if (parentTodo === undefined) {
        const newtodo = new NewTodo(id, todos);
      } else {
        const parent = findtodoById(todos, parentTodo.id);
        const newtodo = new NewTodo(id, todos, parent);
      }

      todoDataProvider.refresh(todos);
      context.globalState.update(SIMPLY_TODO_STORAGE_KEY, todos);
      console.log(context.globalState.get(SIMPLY_TODO_STORAGE_KEY, []));
      console.log(todos);
    }
  );

  // Command to delete a given todo
  const deleteTodo = commands.registerCommand("simplytodo.deleteTodo", (node: TodoTreeItem) => {
    const todo = findtodoById(todos, node.id);
    if (!todo) {
      return;
    }

    const parent = findParent(todos, todo.parent ? todo.parent : []);
    const deleted = deleteTreetodo(todos, todo);

    if (deleted) {
      if (parent && parent.children.length === 0) {
        parent.collapsibleState = TreeItemCollapsibleState.None;
      }
      todoDataProvider.refresh(todos);
      context.globalState.update(SIMPLY_TODO_STORAGE_KEY, todos);
    }
  });

  // List Commands
  context.subscriptions.push(createTodo);
  context.subscriptions.push(deleteTodo);
  context.subscriptions.push(refreshList);
  context.subscriptions.push(showTodoDetail);
  context.subscriptions.push(editItem);

  // Details View
  context.subscriptions.push(refreshDetail);
}

// This method is called when your extension is deactivated
export function deactivate() {}
