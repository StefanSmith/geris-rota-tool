import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import createSpreadsheetAuthor from "./adapters/google/googleSheetsSpreadsheetAuthor.ts";
import createSystemClock from "./adapters/systemClock.ts";
import {createRotaSpreadsheetExporter} from "./domain/rotaSpreadsheetExporter.ts";

const systemClock = createSystemClock();

const rotaSpreadsheetExporter = createRotaSpreadsheetExporter(
    createSpreadsheetAuthor({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        authClientId: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID
    }),
    systemClock
);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App rotaSpreadsheetExporter={rotaSpreadsheetExporter} clock={systemClock}/>
    </StrictMode>,
)
