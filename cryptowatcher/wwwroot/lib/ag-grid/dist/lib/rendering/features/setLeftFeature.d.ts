import { ColumnGroupChild } from "../../entities/columnGroupChild";
import { BeanStub } from "../../context/beanStub";
export declare class SetLeftFeature extends BeanStub {
    private columnOrGroup;
    private eCell;
    private actualLeft;
    private gridOptionsWrapper;
    private columnAnimationService;
    constructor(columnOrGroup: ColumnGroupChild, eCell: HTMLElement);
    private init();
    private setLeftFirstTime();
    private animateInLeft();
    private onLeftChanged();
    private setLeft(value);
}
