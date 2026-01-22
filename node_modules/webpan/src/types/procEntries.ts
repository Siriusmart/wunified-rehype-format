import type Processor = require("./processor");
import type ProcessorHandle = require("./processorHandle");
import type BuildInstance = require("../types/buildInstance");
import type procEntries = require("../types/procEntries");

export type ProcByFileMap = Map<string, Map<string, Set<ProcessorHandle>>>;
export type ProcByIdMap = Map<string, ProcessorHandle>;

export interface ProcessorMetaEntry {
    childPath: string;
    procName: string;
    relativePath: string;
    ruleLocation: string;
    settings: any;
}
export type ProcClass = {
    new (
        buildInstance: BuildInstance,
        meta: procEntries.ProcessorMetaEntry,
        id?: string
    ): Processor;
};
export type DiffType = "changed" | "removed" | "created";
export type DiffEntries<K> = Map<K, DiffType>;
