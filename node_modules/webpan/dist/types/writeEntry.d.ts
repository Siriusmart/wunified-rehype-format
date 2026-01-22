import type fsEntries = require("./fsEntries");
import ProcessorHandle = require("./processorHandle");
export interface OutputTarget {
    surface: {
        procId: string;
        priority: number;
    } | null;
    allOutputs: Map<string, number>;
    newWrites: Map<string, WriteEntry>;
}
export interface WriteEntry {
    processor: ProcessorHandle;
    content: fsEntries.BufferLike | "remove";
    priority: number;
}
export type WriteEntryManagerState = "writable" | "readonly" | "disabled";
//# sourceMappingURL=writeEntry.d.ts.map