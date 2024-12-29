import './App.css'
import {useState} from "react";
import spinner from './assets/spinner.gif'
import {RotaTableGenerator} from "./domain/rotaTableGenerator.ts";
import {SpreadsheetExporter} from "./domain/ports.ts";

type AppProps = {
    spreadsheetExporter: SpreadsheetExporter,
    rotaTableGenerator: RotaTableGenerator
};

function App({spreadsheetExporter, rotaTableGenerator}: AppProps) {
    const [generatingSpreadsheet, setGeneratingSpreadsheet] = useState(false);
    const [spreadsheetUrl, setSpreadsheetUrl] = useState(undefined as string | undefined);

    async function generateRota() {
        setGeneratingSpreadsheet(true);

        const result = await spreadsheetExporter.exportSpreadsheet(
            `Geris Rota (Generated ${new Date().toISOString()})`,
            rotaTableGenerator.generateRotaTable()
        );

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
