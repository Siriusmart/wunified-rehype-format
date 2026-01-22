import writeEntry = require("../types/writeEntry");
import type fsEntries = require("../types/fsEntries");
interface OutputActions {
    removes: Set<string>;
    moves1: [string, string][];
    moves2: [string, string][];
    writes: [string, fsEntries.BufferLike][];
}
declare class WriteEntriesManager {
    private state;
    private outputTargets;
    constructor(outputTargets: Map<string, writeEntry.OutputTarget>);
    __getOutputTargets(): Map<string, writeEntry.OutputTarget>;
    set(path: string, content: writeEntry.WriteEntry): void;
    getActions(): OutputActions;
    setState(state: writeEntry.WriteEntryManagerState): void;
}
export = WriteEntriesManager;
//# sourceMappingURL=writeEntriesManager.d.ts.map