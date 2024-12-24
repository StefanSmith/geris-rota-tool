import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import createSpreadsheetExporter from "./adapters/googleSheetsSpreadsheetExporter.ts";

const spreadsheetExporter = createSpreadsheetExporter({
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    authClientId: import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App exportSpreadsheet={spreadsheetExporter.exportSpreadsheet}/>
    </StrictMode>,
)
