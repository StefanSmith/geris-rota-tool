import './App.css'
import {useState} from "react";
import spinner from './assets/spinner.gif'
import createRotaTableGenerator, {RotaTableGenerator} from "./domain/rotaTableGenerator.ts";
import {RotaSpreadsheetExporter} from "./domain/rotaSpreadsheetExporter.ts";
import {Clock} from "./domain/ports.ts";
import {AddDoctorDialog} from "./AddDoctorDialog.tsx";
import {Doctor} from "./domain/types.ts";

type AppProps = {
    rotaTableGenerator: RotaTableGenerator,
    rotaSpreadsheetExporter: RotaSpreadsheetExporter
};

export function App({rotaTableGenerator, rotaSpreadsheetExporter}: AppProps) {
    const [generatingSpreadsheet, setGeneratingSpreadsheet] = useState(false);
    const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | undefined>(undefined);
    const [addingDoctor, setAddingDoctor] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    async function displayAddDoctorDialog() {
        setAddingDoctor(true);
    }

    async function generateRota() {
        setGeneratingSpreadsheet(true);
        const rotaTable = rotaTableGenerator.generateRotaTable({doctors});
        const result = await rotaSpreadsheetExporter.exportRota(rotaTable);
        setGeneratingSpreadsheet(false);
        setSpreadsheetUrl(result.spreadsheetUrl);
    }

    function handleAddDoctorRequested(doctor: Doctor) {
        setDoctors(doctors => [...doctors, doctor]);
        setAddingDoctor(false);
    }

    return (
        <>
            {addingDoctor && <AddDoctorDialog show={addingDoctor} onAddDoctorRequested={handleAddDoctorRequested}/>}
            <div className="card">
                {
                    generatingSpreadsheet ?
                        <img src={spinner} alt="Spinner"/> :
                        <>
                            <button onClick={displayAddDoctorDialog}>Add Doctor</button>
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