"use strict";
const path = require("path");
const assert = require("assert");
const fs = require("fs/promises");
const wrules = require("../info/wrules");
const fsUtils = require("../utils/fsUtils");
const NewFiles = require("../types/newfiles");
let currentlyBuilding = null;
let nextBuilding = null;
async function buildDiffInternal(buildInstance, fsContent, hashedEntries, fsDiff) {
    await buildInstance
        .withBuildCycleState("writable")
        .withFsContent(fsContent, hashedEntries, fsDiff);
    let cachedProcessors = buildInstance.getProcByFiles();
    let newFiles = new Set(fsDiff.entries().filter(([_, diffType]) => diffType === "created").map(([name, _]) => name));
    if (newFiles.size !== 0)
        buildInstance.getProcById().values().forEach(proc => {
            if (proc.processor.shouldRebuild(new NewFiles(newFiles, proc)))
                proc.reset();
        });
    for (const [filePath, diffType] of fsDiff.entries()) {
        // IMPORTANT! update cachedProcessors
        switch (diffType) {
            case "removed":
            case "changed":
                cachedProcessors
                    .get(filePath)
                    ?.values()
                    .forEach((handles) => handles.forEach((handle) => {
                    if (diffType === "changed") {
                        const content = fsContent.get(filePath)?.content;
                        assert(content !== undefined);
                        // toBuild.push([handle, content[0] === "file" ? content[1] : "dir"])
                    }
                    handle.reset();
                    if (diffType === "removed") {
                        handle.drop();
                    }
                }));
                if (diffType === "removed") {
                    cachedProcessors.delete(filePath);
                }
                break;
            case "created":
                const resolvedProcessors = await wrules.resolveProcessors(buildInstance, filePath);
                cachedProcessors.set(filePath, new Map());
                resolvedProcessors.values().forEach((procEntry) => {
                    const meta = {
                        childPath: filePath,
                        // fullPath: path.join(root, "src", filePath),
                        procName: procEntry.procName,
                        relativePath: procEntry.relativePath,
                        ruleLocation: procEntry.ruleLocation,
                        // pattern: procEntry.pattern,
                        settings: procEntry.settings,
                    };
                    let proc = new procEntry.processorClass(buildInstance, meta);
                    if (!cachedProcessors.has(filePath)) {
                        cachedProcessors.set(filePath, new Map());
                    }
                    if (!cachedProcessors.get(filePath)?.has(procEntry.procName)) {
                        cachedProcessors
                            .get(filePath)
                            ?.set(procEntry.procName, new Set());
                    }
                    cachedProcessors
                        .get(filePath)
                        ?.get(procEntry.procName)
                        ?.add(proc.__handle);
                    const content = fsContent.get(filePath)?.content;
                    assert(content !== undefined);
                });
            // get processors
            // insert each task into cachedProcessors (flat)
            // add task to toBuild
            // remember to try catch each build so one failed build dont spoil everything
        }
    }
    const res = await buildInstance.buildOutputAll();
    res.forEach(([handle, output]) => {
        handle.updateWithOutput(output, buildInstance.getWriteEntriesManager());
    });
    buildInstance.withBuildCycleState("readonly");
    await buildInstance.flush();
    buildInstance.withBuildCycleState("disabled");
    await buildInstance.writeMeta();
}
// async function buildDiff(root: string, manifest: wmanifest.WManifest, writeEntries: WriteEntriesManager, fsContent: fsEntries.FsContentEntries, diff: procEntries.DiffEntries<string>, hashedEntries: fsEntries.HashedEntries): Promise<void> {
async function buildDiff(buildInstance, fsContent, diff, hashedEntries) {
    if (currentlyBuilding === null) {
        currentlyBuilding = buildDiffInternal(buildInstance, fsContent, hashedEntries, diff);
        await currentlyBuilding;
        currentlyBuilding = null;
        return;
    }
    if (nextBuilding === null) {
        nextBuilding = [
            new Promise(async (res) => {
                assert(nextBuilding !== null);
                for (const [entryPath, entryDiff] of diff.entries()) {
                    switch (entryDiff) {
                        case "changed":
                        case "removed":
                            nextBuilding[1].set(entryPath, entryDiff);
                            break;
                        case "created":
                            if (nextBuilding[1].has(entryPath)) {
                                nextBuilding[1].set(entryPath, "changed");
                            }
                            else {
                                nextBuilding[1].set(entryPath, entryDiff);
                            }
                            break;
                    }
                }
                await currentlyBuilding;
                currentlyBuilding = buildDiffInternal(buildInstance, nextBuilding[3], nextBuilding[2], nextBuilding[1]);
                nextBuilding = null;
                await currentlyBuilding;
                currentlyBuilding = null;
                res();
            }),
            new Map(),
            hashedEntries,
            fsContent,
        ];
    }
    else {
        await nextBuilding[0];
    }
}
module.exports = buildDiff;
//# sourceMappingURL=buildDiff.js.map