import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import createRotaTableGenerator from "./domain/rotaTableGenerator.ts";
import createSpreadsheetExporter from "./adapters/google/googleSheetsSpreadsheetExporter.ts";

const spreadsheetExporter = createSpreadsheetExporter({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    authClientId: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID
});

const rotaTableGenerator = createRotaTableGenerator();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App exportSpreadsheet={spreadsheetExporter.exportSpreadsheet}
             generateRotaTable={rotaTableGenerator.generateRotaTable}/>
    </StrictMode>,
)