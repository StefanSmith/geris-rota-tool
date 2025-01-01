import './App.css'
import {useState} from "react";
import spinner from './assets/spinner.gif'
import createRotaTableGenerator, {RotaTableGenerator} from "./domain/rotaTableGenerator.ts";
import {RotaSpreadsheetExporter} from "./domain/rotaSpreadsheetExporter.ts";
import {Clock} from "./domain/ports.ts";

type AppProps = {
    rotaTableGenerator: RotaTableGenerator,
    rotaSpreadsheetExporter: RotaSpreadsheetExporter
};

export function App({rotaTableGenerator, rotaSpreadsheetExporter}: AppProps) {
    const [generatingSpreadsheet, setGeneratingSpreadsheet] = useState(false);
    const [spreadsheetUrl, setSpreadsheetUrl] = useState(undefined as string | undefined);

    async function generateRota() {
        setGeneratingSpreadsheet(true);
        const rotaTable = rotaTableGenerator.generateRotaTable();
        const result = await rotaSpreadsheetExporter.exportRota(rotaTable);
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

type AppContainerProps = {
    rotaSpreadsheetExporter: RotaSpreadsheetExporter,
    clock: Clock
};

const AppContainer = ({rotaSpreadsheetExporter, clock}: AppContainerProps) =>
    <App
        rotaTableGenerator={createRotaTableGenerator(clock)}
        rotaSpreadsheetExporter={rotaSpreadsheetExporter}
    />;

export default AppContainer;