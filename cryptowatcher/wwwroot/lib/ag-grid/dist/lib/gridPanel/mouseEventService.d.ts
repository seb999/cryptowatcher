import { GridCell } from "../entities/gridCell";
import { CellComp } from "../rendering/cellComp";
export declare class MouseEventService {
    private gridOptionsWrapper;
    getRenderedCellForEvent(event: MouseEvent | KeyboardEvent): CellComp;
    getGridCellForEvent(event: MouseEvent | KeyboardEvent): GridCell;
}
