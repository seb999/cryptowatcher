import { Column } from "../entities/column";
import { RowNode } from "../entities/rowNode";
export declare class ValueFormatterService {
    private gridOptionsWrapper;
    formatValue(column: Column, rowNode: RowNode, $scope: any, rowIndex: number, value: any): string;
}
