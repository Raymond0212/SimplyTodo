import { CancellationToken, Uri, Webview, WebviewView, WebviewViewProvider } from "vscode";
import { Todo } from "../types/Todo";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";

export class TodoDetailViewProvider implements WebviewViewProvider {
  private _view?: WebviewView;
  private _todo?: Todo;

  constructor(private readonly _extensionUri: Uri) {}

  public resolveWebviewView(
    webviewView: WebviewView,
    _context: unknown,
    _token: CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView;

    this._view.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    this._view.webview.html = this._getHtmlForWebview(this._view.webview);
  }

  public refresh(todo: Todo): void {
    this._todo = todo;
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
    }
  }

  private _getHtmlForWebview(webview: Webview) {
    const scriptUri = webview.asWebviewUri(Uri.joinPath(this._extensionUri, "dist", "webview.js"));
    const nonce = getNonce();
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Todo Details</title>
      </head>
      <body>
          <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}
