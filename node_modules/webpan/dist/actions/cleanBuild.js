"use strict";
const path = require("path");
const fs = require("fs/promises");
const fsUtils = require("../utils/fsUtils");
async function cleanBuild(root) {
    const distPath = path.join(root, "dist");
    if (await fsUtils.exists(distPath)) {
        await fs.rm(distPath, { recursive: true });
    }
    const shadowPath = path.join(root, "meta/shadowed");
    if (await fsUtils.exists(shadowPath)) {
        await fs.rm(shadowPath, { recursive: true });
    }
    const buildInfoPath = path.join(root, "meta", "buildInfo.json");
    if (await fsUtils.exists(buildInfoPath)) {
        await fs.rm(buildInfoPath);
    }
}
module.exports = cleanBuild;
//# sourceMappingURL=cleanBuild.js.map