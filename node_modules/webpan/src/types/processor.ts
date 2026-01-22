import micromatch = require("micromatch");

import type BuildInstance = require("./buildInstance");
import type NewFiles = require("./newfiles");
import type procEntries = require("./procEntries");
import type processorStates = require("./processorStates");

import type ProcessorHandle = require("./processorHandle");
import path = require("path");

class FileNamedProcOne {
    private parent: ProcessorHandle;
    private proc: ProcessorHandle;

    constructor(parent: ProcessorHandle, proc: ProcessorHandle) {
        this.parent = parent;
        this.proc = proc;
    }

    public async getResult(): Promise<processorStates.ProcessorResult> {
        return await this.proc.getResult(this.parent);
    }

    public async getProcessor(): Promise<Processor> {
        return await this.proc.getProcessor(this.parent);
    }

    public equals(other: Processor): boolean {
        return this.proc.processor === other
    }
}

class FileNamedProcs {
    private parent: ProcessorHandle;
    private procsSet: Set<ProcessorHandle>;

    constructor(parent: ProcessorHandle, procsSet: Set<ProcessorHandle>) {
        this.parent = parent;
        this.procsSet = procsSet;
    }

    public values(): IteratorObject<FileNamedProcOne> {
        return this.procsSet
            .values()
            .map((proc) => new FileNamedProcOne(this.parent, proc));
    }

    public toSet(): Set<FileNamedProcOne> {
        return new Set(this.values());
    }
}

class FileProcs {
    private parent: ProcessorHandle;
    private procsMap: Map<string, Set<ProcessorHandle>>;

    constructor(
        parent: ProcessorHandle,
        procsMap: Map<string, Set<ProcessorHandle>>
    ) {
        this.parent = parent;
        this.procsMap = procsMap;
    }

    public procs(
        options: { include?: string | string[], exclude?: string | string[] } = {}
    ): Map<string, FileNamedProcs> {
        let out: Map<string, FileNamedProcs> = new Map();

        for (const [name, fileNamedProcs] of this.procsMap.entries()) {
            if ((options.include === undefined && options.exclude === undefined) ||
                micromatch.isMatch(name, options.include ?? "**", { ignore: options.exclude })) {
                out.set(name, new FileNamedProcs(this.parent, fileNamedProcs));
            }
        }

        return out;
    }
}

abstract class Processor {
    __handle: ProcessorHandle;
    private buildInstance: BuildInstance;

    constructor(
        buildInstance: BuildInstance,
        meta: procEntries.ProcessorMetaEntry,
        id?: string
    ) {
        const ProcessorHandle = require("./processorHandle");
        this.buildInstance = buildInstance;
        this.__handle = new ProcessorHandle(buildInstance, meta, this, id);
    }

    public filePath(options: { absolute?: boolean } = {}): string {
        if (options.absolute !== true) {
            return this.__handle.meta.relativePath;
        } else {
            return this.__handle.meta.childPath;
        }
    }

    public parentPath(option: { absolute?: boolean } = {}): string {
        return path.dirname(this.filePath(option))
    }

    public files(
        options: { include?: string | string[], exclude?: string | string[], absolute?: boolean } = {}
    ): Map<string, FileProcs> {
        let dirPath = this.__handle.meta.ruleLocation;

        let out: Map<string, FileProcs> = new Map();

        for (const [absPath, procsMap] of this.buildInstance
            .getProcByFiles()
            .entries()) {
            let relPath;

            if (options.absolute ?? false) {
                relPath = absPath;
            } else {
                if (!absPath.startsWith(dirPath)) {
                    continue;
                }

                relPath = absPath.substring(dirPath.length - 1);
            }

            if (
                (options.include === undefined && options.exclude === undefined) ||
                micromatch.isMatch(relPath, options.include ?? "**", { ignore: options.exclude })
            ) {
                out.set(relPath, new FileProcs(this.__handle, procsMap));
            }
        }

        return out;
    }
    
    public settings(): any {
        return this.__handle.meta.settings;
    }

    abstract build(
        content: Buffer | "dir"
    ): Promise<processorStates.ProcessorOutputRaw>;

    shouldRebuild(newFiles: NewFiles): boolean {
        return false;
    }
}

export = Processor;
