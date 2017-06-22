import { RowNodeBlock } from "./rowNodeBlock";
export declare class RowNodeBlockLoader {
    private activeBlockLoadsCount;
    private blocks;
    private maxConcurrentRequests;
    private logger;
    private active;
    constructor(maxConcurrentRequests: number);
    private setBeans(loggerFactory);
    addBlock(block: RowNodeBlock): void;
    removeBlock(block: RowNodeBlock): void;
    destroy(): void;
    loadComplete(): void;
    checkBlockToLoad(): void;
    getBlockState(): any;
    private printCacheStatus();
}
