import { Component } from "../../widgets/component";
import { ICellEditorComp, ICellEditorParams } from "./iCellEditor";
export declare class TextCellEditor extends Component implements ICellEditorComp {
    private static TEMPLATE;
    private highlightAllOnFocus;
    private focusAfterAttached;
    constructor();
    init(params: ICellEditorParams): void;
    afterGuiAttached(): void;
    focusIn(): void;
    getValue(): any;
}
