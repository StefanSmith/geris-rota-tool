import './App.css'
import {useState} from "react";
import spinner from './assets/spinner.gif'
import {ExportSpreadsheetFunction, GenerateRotaTableFunction} from "./ports.ts";

type AppProps = {
    exportSpreadsheet: ExportSpreadsheetFunction,
    generateRotaTable: GenerateRotaTableFunction
};

function App({exportSpreadsheet, generateRotaTable}: AppProps) {
    const [generatingSpreadsheet, setGeneratingSpreadsheet] = useState(false);
    const [spreadsheetUrl, setSpreadsheetUrl] = useState(undefined as string | undefined);

    async function generateRota() {
        setGeneratingSpreadsheet(true);

        const result = await exportSpreadsheet({
            title: `Geris Rota (Generated ${new Date().toISOString()})`,
            table: generateRotaTable()
        });

        setGeneratingSpreadsheet(false);
        setSpreadsheetUrl(result.spreadsheetUrl);
    }

    return (
        <>
            <div className="card">
                {
                    generatingSpreadsheet ?
                        <img src={spinner} alt="Spinner"/> :
                        <>
                            <button onClick={generateRota}>Export Rota</button>
                            <p>
                                {
                                    spreadsheetUrl &&
                                    <a href={spreadsheetUrl} target="_blank">Open rota</a>
                                }
                            </p>
                        </>
                }
            </div>
        </>
    )
}

export default App
