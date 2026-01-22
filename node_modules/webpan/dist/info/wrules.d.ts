import type procEntries = require("../types/procEntries");
import type BuildInstance = require("../types/buildInstance");
declare function updateRules(buildInstance: BuildInstance): Promise<void>;
interface FoundProcessorEntry {
    processorClass: procEntries.ProcClass;
    settings: any;
    relativePath: string;
    ruleLocation: string;
    pattern: string;
    procName: string;
}
declare function resolveProcessors(buildInstance: BuildInstance, dirCursor: string, fileName?: string): Promise<Set<FoundProcessorEntry>>;
declare const _default: {
    updateRules: typeof updateRules;
    resolveProcessors: typeof resolveProcessors;
};
export = _default;
//# sourceMappingURL=wrules.d.ts.map