import type ProcessorHandle = require("./processorHandle");
declare class NewFiles {
    private internal;
    private handle;
    constructor(internal: Set<string>, handle: ProcessorHandle);
    files(options?: {
        absolute?: boolean;
        include?: string | string[];
        exclude?: string | string[];
    }): Set<string>;
}
export = NewFiles;
//# sourceMappingURL=newfiles.d.ts.map