import { useState, useEffect } from "react";

declare const vscode: {
  postMessage(message: any): void;
};

export const App = () => {
  const [messageFromExtension, setMessageFromExtension] = useState<string>("");
  const [messageToSend, setMessageToSend] = useState<string>("");

  // --- Communication: Extension -> Webview ---
  useEffect(() => {
    // This function will be called when a message is received from the extension host.
    const handleMessage = (event: MessageEvent) => {
      const message = event.data; // The JSON data that the extension sent
      switch (message.command) {
        case "initial-data":
          setMessageFromExtension(message.payload);
          break;
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup listener when the component unmounts
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const sendMessageToExtension = () => {
    vscode.postMessage({
      command: "alert",
      text: "Message from Webview: ",
    });
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <h4>No todo selected</h4>
      <p>Select a todo from the list to see its details.</p>
    </div>
  );
};
