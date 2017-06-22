import { RowDataTransaction } from "./inMemoryRowModel";
export declare class ImmutableService {
    private rowModel;
    private gridOptionsWrapper;
    private inMemoryRowModel;
    private postConstruct();
    createTransactionForRowData(data: any[]): RowDataTransaction;
}
