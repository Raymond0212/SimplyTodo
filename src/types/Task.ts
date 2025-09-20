import { TreeItemCheckboxState } from "vscode";

export interface Task {
  id: string;
  title: string;
  content?: string;
  tags?: string[];
  children: Task[];
  status: TreeItemCheckboxState;
}

export class NewTask implements Task {
  id: string;
  title: string = "New Task";
  content?: string = "";
  tags?: string[];
  children: Task[] = [];
  status: TreeItemCheckboxState = TreeItemCheckboxState.Unchecked;

  constructor(
    id: string,
    tasks: Task[],
    parentTask?: Task,
    title?: string,
    content?: string,
    tags?: string[]
  ) {
    this.id = id;
    if (title) {
      this.title = title;
    }
    if (content) {
      this.content = content;
    }
    if (tags) {
      this.tags = tags;
    }
    if (parentTask) {
      parentTask.children.push(this);
    } else {
      tasks.push(this);
    }
  }
}
