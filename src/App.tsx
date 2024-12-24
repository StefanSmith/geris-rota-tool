import './App.css'
import {useState} from "react";
import spinner from './assets/spinner.gif'

type AppProps = {
    exportSpreadsheet: ({title}: { title: string }) => Promise<{ spreadsheetUrl: string }>
};

function App({exportSpreadsheet}: AppProps) {
    const [generatingSpreadsheet, setGeneratingSpreadsheet] = useState(false);
    const [spreadsheetUrl, setSpreadsheetUrl] = useState(undefined as string | undefined);

    async function generateRota() {
        setGeneratingSpreadsheet(true);

        const result = await exportSpreadsheet({
            title: `Geris Rota (Generated ${new Date().toISOString()})`
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
                            <button onClick={generateRota}>Generate Rota</button>
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
