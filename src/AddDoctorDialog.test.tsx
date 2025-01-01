import {expect, test, vi} from 'vitest';
import {render, screen} from "@testing-library/react";
import {AddDoctorDialog} from "./AddDoctorDialog.tsx";
import userEvent from "@testing-library/user-event";

/**
 * @vitest-environment jsdom
 */

test('renders open dialog when instructed to be shown', () => {
    render(<AddDoctorDialog show={true} onAddDoctorRequested={() => {
    }}/>);

    const dialog = screen.queryByRole('dialog', {name: 'Add Doctor'});
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('open');
});

test('does not open dialog when not instructed to be shown', () => {
    render(<AddDoctorDialog show={false} onAddDoctorRequested={() => {
    }}/>);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('closes dialog when instructed to be hidden after being shown', () => {
    const {rerender} = render(<AddDoctorDialog show={true} onAddDoctorRequested={() => {
    }}/>);

    const dialogBefore = screen.queryByRole('dialog', {name: 'Add Doctor'});
    expect(dialogBefore).toBeInTheDocument();

    rerender(<AddDoctorDialog show={false} onAddDoctorRequested={() => {}}/>);

    const dialogAfter = screen.queryByRole('dialog', {name: 'Add Doctor'});
    expect(dialogAfter).not.toBeInTheDocument();
});

test('invokes add doctor requested handler when add doctor button clicked', async () => {
    const addDoctorRequestedHandler = vi.fn();

    render(<AddDoctorDialog show={true} onAddDoctorRequested={addDoctorRequestedHandler}/>);

    await userEvent.click(screen.getByRole('button', {name: 'Add Doctor'}));

    expect(addDoctorRequestedHandler).toHaveBeenCalledOnce();
});

test('provides entered information when add doctor requested handler invoked', async () => {
    const addDoctorRequestedHandler = vi.fn();

    render(<AddDoctorDialog show={true} onAddDoctorRequested={addDoctorRequestedHandler}/>);

    await userEvent.type(screen.getByRole('textbox', {name: 'Initials'}), 'DL');

    await userEvent.click(screen.getByRole('button', {name: 'Add Doctor'}));

    expect(addDoctorRequestedHandler).toHaveBeenCalledWith({
        initials: 'DL'
    });
});

test('disables add doctor button when clicked', async () => {
    const addDoctorRequestedHandler = vi.fn();

    render(<AddDoctorDialog show={true} onAddDoctorRequested={addDoctorRequestedHandler}/>);

    const addDoctorButton = screen.getByRole('button', {name: 'Add Doctor'});
    expect(addDoctorButton).not.toBeDisabled();

    await userEvent.click(addDoctorButton);

    expect(addDoctorButton).toBeDisabled();
});