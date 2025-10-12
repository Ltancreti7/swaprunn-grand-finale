import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isNativeIos } from './lib/native';
import { Capacitor } from '@capacitor/core';

// Runtime logging for debugging native builds
console.log('🚀 SwapRunn startup:', {
  platform: Capacitor.getPlatform(),
  isNative: Capacitor.isNativePlatform(),
  origin: window.location.origin,
  href: window.location.href,
  timestamp: new Date().toISOString()
});

if (isNativeIos()) {
  document.body.classList.add('native-ios');
}

createRoot(document.getElementById("root")!).render(<App />);
