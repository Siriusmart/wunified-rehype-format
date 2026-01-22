import type fsEntries = require("../types/fsEntries");
import type procEntries = require("../types/procEntries");
import type BuildInstance = require("../types/buildInstance");
declare function buildDiff(buildInstance: BuildInstance, fsContent: fsEntries.FsContentEntries, diff: procEntries.DiffEntries<string>, hashedEntries: fsEntries.HashedEntries): Promise<void>;
export = buildDiff;
//# sourceMappingURL=buildDiff.d.ts.map