import {useEffect, useRef, useState} from "react";
import {Doctor} from "./domain/types.ts";

type Props = { show: boolean, onAddDoctorRequested: (doctor: Doctor) => void };
export const AddDoctorDialog = ({show, onAddDoctorRequested}: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [addingDoctor, setAddingDoctor] = useState(false);
    const [initials, setInitials] = useState('');

    function addDoctorRequestedHandler() {
        setAddingDoctor(true);
        onAddDoctorRequested({initials});
    }

    useEffect(() => {
        if (dialogRef.current) {
            if (show && !dialogRef.current.open) {
                dialogRef.current.showModal();
            } else if (!show && dialogRef.current.open) {
                dialogRef.current.close();
            }
        }
    }, [show]);

    return <dialog ref={dialogRef} aria-modal={true} role="dialog" aria-label="Add Doctor">
        <label htmlFor="initials">Initials</label>
        <input type="text" id="initials" value={initials} onChange={event => setInitials(event.target.value)}/>
        <button disabled={addingDoctor} onClick={addDoctorRequestedHandler}>Add Doctor</button>
    </dialog>;
};