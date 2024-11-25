import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImportView } from "../src/importView"; // Upraviť cestu k zdrojovému kódu

describe("ImportView component", () => {
    test("should call updateDoc with correct data on import", () => {
        const mockUpdateDoc = jest.fn();
        const mockBuffer = { file: { id: "file1", name: "example.docx" }, ext: ".docx" };
        const mockSetBuffer = jest.fn();

        render(
            <ImportView
                updateDoc={mockUpdateDoc}
                buffer={mockBuffer}
                setBuffer={mockSetBuffer}
            />
        );

        // Simulácia kliknutia na tlačidlo "Import"
        const importButton = screen.getByText("Import");
        fireEvent.click(importButton);

        // test
        expect(mockUpdateDoc).toHaveBeenCalled();
        expect(mockSetBuffer).toHaveBeenCalledWith(undefined);
    });
});
