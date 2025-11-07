import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
  MarkdownString,
  TreeItemCollapsibleState,
} from "vscode";
import { Todo } from "../types/Todo";

type TreeDataOnChangeEvent = TodoTreeItem | undefined | null | void;

/**
 * An implementation of the TreeDataProvider interface.
 *
 * This class is responsible for managing the tree data that the VS Code
 * TreeView API needs to render a custom tree view.
 */
export class TodoTreeDataProvider implements TreeDataProvider<TodoTreeItem> {
  private _onDidChangeTreeData = new EventEmitter<TreeDataOnChangeEvent>();
  readonly onDidChangeTreeData: Event<TreeDataOnChangeEvent> = this._onDidChangeTreeData.event;

  data: TodoTreeItem[];

  constructor(todosData: Todo[]) {
    this.data = todosData.map((todo) => new TodoTreeItem(todo));
  }

  refresh(todosData: Todo[]): void {
    this._onDidChangeTreeData.fire();
    this.data = todosData.map((todo) => new TodoTreeItem(todo));
  }

  getTreeItem(element: TodoTreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: TodoTreeItem | undefined): ProviderResult<TodoTreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return Promise.resolve(element.children);
  }

  getParent(element: TodoTreeItem): ProviderResult<TodoTreeItem> {
    return element.parent;
  }
}

export class TodoTreeItem extends TreeItem {
  children?: TodoTreeItem[];
  parent?: TodoTreeItem;
  declare id: string;

  constructor(todo: Todo, parent?: TodoTreeItem) {
    super(todo.title, todo.collapsibleState);
    this.id = todo.id;
    this.checkboxState = todo.status;
    this.parent = parent;
    this.children = todo.children?.map((child) => new TodoTreeItem(child, this));
    this.tooltip = new MarkdownString(todo.title);
    this.command = {
      title: "Open todo",
      command: "simplytodo.showTodoDetail",
      arguments: [todo],
    };
  }
}
