import path = require("path");

import type procEntries = require("../types/procEntries");

import Processor = require("../types/processor");
import fsUtils = require("../utils/fsUtils");

let cachedProcessorClasses: Map<string, { new (): Processor }> = new Map();

async function getProcessor(
    root: string,
    ident: string
): Promise<procEntries.ProcClass> {
    const cachedProcessor = cachedProcessorClasses.get(ident);

    if (cachedProcessor !== undefined) {
        return cachedProcessor;
    }

    const procPath = path.join(root, "node_modules", `wp-${ident}`);
    if (!(await fsUtils.existsDir(procPath))) {
        throw new Error(`Processor not found: no directory at ${procPath}`);
    }

    const procClass = (require(`wp-${ident}`) ?? {}).default;
    if (typeof procClass !== "function") {
        throw new Error(
            `Package ${ident} doesn't seem to be a webpan processor`
        );
    }

    cachedProcessorClasses.set(ident, procClass);
    return procClass;
}

export = getProcessor;
