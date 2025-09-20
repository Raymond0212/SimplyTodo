import {
  commands,
  ExtensionContext,
  WebviewPanel,
  window,
  ViewColumn,
  Uri,
  TreeItemCheckboxState,
} from "vscode";
import { v4 as uuidv4 } from "uuid";
import { TodoDataProvider } from "./providers/TodoDataProvider";
import { getWebviewContent } from "./ui/getWebviewContent";
import { NewTask, Task } from "./types/Task";

export function activate(context: ExtensionContext) {
  const TASKS_STORAGE_KEY = "simply-todo-task-list";
  let tasks: Task[] = context.globalState.get(TASKS_STORAGE_KEY, []);
  let panel: WebviewPanel | undefined = undefined;

  const todoDataProvider = new TodoDataProvider(tasks);

  // Create a tree view to contain the list of todo tasks
  const treeView = window.createTreeView("simplytodo.todoListView", {
    treeDataProvider: todoDataProvider,
    showCollapseAll: false,
  });

  // Command to render a webview-based task view
  const openTask = commands.registerCommand("simplytodo.showTaskDetailView", () => {
    const selectedTreeViewItem = treeView.selection[0];
    if (!selectedTreeViewItem) {
      return;
    }
    const matchingTask = tasks.find((task) => task.id === selectedTreeViewItem.id);
    if (!matchingTask) {
      window.showErrorMessage("No matching task found");
      return;
    }

    // If no panel is open, create a new one and update the HTML
    if (!panel) {
      panel = window.createWebviewPanel("taskDetailView", matchingTask.title, ViewColumn.One, {
        // Enable JavaScript in the webview
        enableScripts: true,
        // Restrict the webview to only load resources from the `out` directory
        localResourceRoots: [Uri.joinPath(context.extensionUri, "out")],
      });
    }

    // If a panel is open, update the HTML with the selected item's content
    panel.title = matchingTask.title;
    panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, matchingTask);

    // If a panel is open and receives an update message, update the tasks array and the panel title/html
    panel.webview.onDidReceiveMessage((message) => {
      const command = message.command;
      const task = message.task;
      switch (command) {
        case "updateTask":
          const updatedTaskId = task.id;
          const copyOfTasksArray = [...tasks];
          const matchingTaskIndex = copyOfTasksArray.findIndex((t) => t.id === updatedTaskId);
          copyOfTasksArray[matchingTaskIndex] = task;
          tasks = copyOfTasksArray;
          todoDataProvider.refresh(tasks);
          context.globalState.update(TASKS_STORAGE_KEY, tasks);
          panel
            ? ((panel.title = task.title),
              (panel.webview.html = getWebviewContent(panel.webview, context.extensionUri, task)))
            : null;
          break;
      }
    });

    panel.onDidDispose(
      () => {
        // When the panel is closed, cancel any future updates to the webview content
        panel = undefined;
      },
      null,
      context.subscriptions
    );
  });

  // Command to create a new task
  const createBaseTask = commands.registerCommand("simplytodo.createBaseTask", () => {
    const id = uuidv4();

    const newTask = new NewTask(id, tasks);

    todoDataProvider.refresh(tasks);
    context.globalState.update(TASKS_STORAGE_KEY, tasks);
  });

  // Command to create a new task
  const createTask = commands.registerCommand("simplytodo.createTask", (parentTask: Task) => {
    const id = uuidv4();

    const newTask = new NewTask(id, tasks, parentTask);

    todoDataProvider.refresh(tasks);
    context.globalState.update(TASKS_STORAGE_KEY, tasks);
  });

  // Command to delete a given task
  const deleteTask = commands.registerCommand("simplytodo.deleteTask", (node: Task) => {
    const selectedTreeViewItem = node;
    const selectedTaskIndex = tasks.findIndex((task) => task.id === selectedTreeViewItem.id);
    tasks.splice(selectedTaskIndex, 1);
    todoDataProvider.refresh(tasks);
    context.globalState.update(TASKS_STORAGE_KEY, tasks);

    // Close the panel if it's open
    panel?.dispose();
  });

  // Add commands to the extension context
  context.subscriptions.push(openTask);
  context.subscriptions.push(createTask);
  context.subscriptions.push(createBaseTask);
  context.subscriptions.push(deleteTask);
}
