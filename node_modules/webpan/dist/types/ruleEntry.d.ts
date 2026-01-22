export type ProcessorType = string | string[] | Map<string, any>;
export interface RuleEntryRaw {
    processors?: Map<string, ProcessorType>;
}
export interface ProcessorSettings {
    procName: string;
    settings: any;
}
export interface RuleEntryNormalised {
    processors: Map<string, Set<ProcessorSettings>>;
}
export type RuleEntries = Map<string, RuleEntryNormalised>;
//# sourceMappingURL=ruleEntry.d.ts.map