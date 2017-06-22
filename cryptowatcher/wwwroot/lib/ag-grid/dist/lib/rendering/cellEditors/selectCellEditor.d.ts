import { Component } from "../../widgets/component";
import { ICellEditorComp } from "./iCellEditor";
export declare class SelectCellEditor extends Component implements ICellEditorComp {
    private focusAfterAttached;
    private eSelect;
    constructor();
    init(params: any): void;
    afterGuiAttached(): void;
    focusIn(): void;
    getValue(): any;
}
