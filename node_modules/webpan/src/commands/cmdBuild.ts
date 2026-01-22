import type yargs = require("yargs");

import path = require("path");
import fs = require("fs/promises");

import WriteEntriesManager = require("../info/writeEntriesManager");
import BuildInstance = require("../types/buildInstance");
import findRoot = require("../info/findRoot");
import buildInfo = require("../info/buildInfo");
import cleanBuild = require("../actions/cleanBuild");
import fsUtils = require("../utils/fsUtils");
import calcHashedEntries = require("../info/calcHashedEntries");
import calcDiff = require("../utils/calcDiff");
import buildDiff = require("../actions/buildDiff");
import wproject = require("../info/wproject");

async function cmdBuild(args: yargs.Arguments): Promise<void> {
    const argPath = args.path as string;
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
    const unwrappedBuildInfo = buildInfo.unwrapBuildInfo(
        root,
        manifest,
        gotBuildInfo
    );

    unwrappedBuildInfo.buildInstance
        .withHashedEntries(unwrappedBuildInfo.hashedEntries)
        .withRules(unwrappedBuildInfo.cachedRules)
        .withProcs(
            unwrappedBuildInfo.cachedProcessors,
            unwrappedBuildInfo.cachedProcessorsFlat
        );

    const srcPath = path.join(root, "src");

    if (!(await fsUtils.exists(srcPath))) {
        await fs.mkdir(srcPath, { recursive: true });
    }

    const srcContents = await fsUtils.readDirRecursive(srcPath);
    const hashedEntries = calcHashedEntries(srcContents);

    // this does not specify whether the changed item is a file or a directory
    // this info is contained in srcContents
    // a changed item must be a file, and exists in srcContents
    const hashedDiff = calcDiff.calcDiff(
        unwrappedBuildInfo.hashedEntries,
        hashedEntries
    );

    await fs.mkdir(path.join(root, "dist"), { recursive: true });
    await buildDiff(unwrappedBuildInfo.buildInstance, srcContents, hashedDiff, hashedEntries);
}

export = cmdBuild;
