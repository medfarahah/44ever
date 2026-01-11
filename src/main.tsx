import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  // Fallback if root element doesn't exist
  const newRoot = document.createElement("div");
  newRoot.id = "root";
  document.body.appendChild(newRoot);
  const root = createRoot(newRoot);
  root.render(<App />);
} else {
  // Ensure body has proper styling
  if (!document.body.style.margin) {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }

  const root = createRoot(rootElement);
  root.render(<App />);
}
