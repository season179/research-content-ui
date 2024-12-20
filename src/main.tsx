import React from "react";
import { createRoot } from "react-dom/client";
import { PostHogProvider } from 'posthog-js/react'
import { App } from "./App";
import "./index.css";

const options = {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
    <React.StrictMode>
        <PostHogProvider 
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
            options={options}
        >
            <App />
        </PostHogProvider>
    </React.StrictMode>
);
