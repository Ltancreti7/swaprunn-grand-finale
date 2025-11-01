import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isNativeIos } from "./lib/native";
import { ErrorBoundary } from "./components/ErrorBoundary";

if (isNativeIos()) {
  document.body.classList.add("native-ios");
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
