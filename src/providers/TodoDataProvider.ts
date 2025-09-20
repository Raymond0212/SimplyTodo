import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
  MarkdownString,
} from "vscode";
import { Task } from "../types/Task";

// A custom type to keep the code below more tidy
type TreeDataOnChangeEvent = TaskTreeItem | undefined | null | void;

/**
 * An implementation of the TreeDataProvider interface.
 *
 * This class is responsible for managing the tree data that the VS Code
 * TreeView API needs to render a custom tree view.
 */
export class TodoDataProvider implements TreeDataProvider<TaskTreeItem> {
  private _onDidChangeTreeData = new EventEmitter<TreeDataOnChangeEvent>();
  readonly onDidChangeTreeData: Event<TreeDataOnChangeEvent> = this._onDidChangeTreeData.event;

  data: TaskTreeItem[];

  constructor(tasksData: Task[]) {
    this.data = tasksData.map((task) => new TaskTreeItem(task));
  }

  refresh(tasksData: Task[]): void {
    this._onDidChangeTreeData.fire();
    this.data = tasksData.map((task) => new TaskTreeItem(task));
  }

  getTreeItem(element: TaskTreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: TaskTreeItem | undefined): ProviderResult<TaskTreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

  getParent() {
    return null;
  }
}

class TaskTreeItem extends TreeItem {
  children?: TaskTreeItem[];

  constructor(task: Task) {
    super(task.title);
    this.id = task.id;
    this.checkboxState = task.status;
    this.children = task.children?.map((child) => new TaskTreeItem(child));
    this.tooltip = new MarkdownString(`### ${task.title}\n\n${task.content}`);
    this.command = {
      title: "Open Task",
      command: "simplytodo.showTaskDetailView",
    };
  }
}
