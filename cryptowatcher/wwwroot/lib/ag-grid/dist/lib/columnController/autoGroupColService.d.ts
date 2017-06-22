import { Column } from "../entities/column";
export declare class AutoGroupColService {
    static GROUP_AUTO_COLUMN_ID: string;
    private gridOptionsWrapper;
    private context;
    createAutoGroupColumns(rowGroupColumns: Column[]): Column[];
    private createOneAutoGroupColumn(rowGroupCol?, index?);
}
