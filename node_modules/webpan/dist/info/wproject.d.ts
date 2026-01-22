import yargs = require("yargs");
import type wmanifest = require("../types/wmanifest");
declare function createProjectManifest(root: string, yargs: yargs.ArgumentsCamelCase<{}>): Promise<wmanifest.WManifest>;
declare const _default: {
    createProjectManifest: typeof createProjectManifest;
};
export = _default;
//# sourceMappingURL=wproject.d.ts.map