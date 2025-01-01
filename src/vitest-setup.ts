import '@testing-library/jest-dom/vitest'
import './testSupport/customMatchers.ts'
import {beforeAll} from "vitest";

beforeAll(() => {
    if (typeof HTMLDialogElement === "function") {
        if (!HTMLDialogElement.prototype.showModal) {
            HTMLDialogElement.prototype.showModal = function () {
                this.open = true;
            }
        }

        if (HTMLDialogElement && !HTMLDialogElement.prototype.close) {
            HTMLDialogElement.prototype.close = function (returnValue) {
                this.open = false;
                this.returnValue = returnValue || '';
            }
        }
    }
});