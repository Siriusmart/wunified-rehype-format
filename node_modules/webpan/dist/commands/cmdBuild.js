"use strict";
const path = require("path");
const fs = require("fs/promises");
const WriteEntriesManager = require("../info/writeEntriesManager");
const BuildInstance = require("../types/buildInstance");
const findRoot = require("../info/findRoot");
const buildInfo = require("../info/buildInfo");
const cleanBuild = require("../actions/cleanBuild");
const fsUtils = require("../utils/fsUtils");
const calcHashedEntries = require("../info/calcHashedEntries");
const calcDiff = require("../utils/calcDiff");
const buildDiff = require("../actions/buildDiff");
const wproject = require("../info/wproject");
async function cmdBuild(args) {
    const argPath = args.path;
    const root = await findRoot(argPath);
    if (root === null) {
        console.error("Project not initialised: no project root found.");
        return;
    }
    const manifest = await wproject.createProjectManifest(root, args);
    if (manifest.cmd.build.clean) {
        await cleanBuild(root);
    }
    const gotBuildInfo = await buildInfo.readBuildInfo(root);
    const unwrappedBuildInfo = buildInfo.unwrapBuildInfo(root, manifest, gotBuildInfo);
    unwrappedBuildInfo.buildInstance
        .withHashedEntries(unwrappedBuildInfo.hashedEntries)
        .withRules(unwrappedBuildInfo.cachedRules)
        .withProcs(unwrappedBuildInfo.cachedProcessors, unwrappedBuildInfo.cachedProcessorsFlat);
    const srcPath = path.join(root, "src");
    if (!(await fsUtils.exists(srcPath))) {
        await fs.mkdir(srcPath, { recursive: true });
    }
    const srcContents = await fsUtils.readDirRecursive(srcPath);
    const hashedEntries = calcHashedEntries(srcContents);
    // this does not specify whether the changed item is a file or a directory
    // this info is contained in srcContents
    // a changed item must be a file, and exists in srcContents
    const hashedDiff = calcDiff.calcDiff(unwrappedBuildInfo.hashedEntries, hashedEntries);
    await fs.mkdir(path.join(root, "dist"), { recursive: true });
    await buildDiff(unwrappedBuildInfo.buildInstance, srcContents, hashedDiff, hashedEntries);
}
module.exports = cmdBuild;
//# sourceMappingURL=cmdBuild.js.map