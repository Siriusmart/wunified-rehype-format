import path = require("path");

import fsUtils = require("../utils/fsUtils");

async function findRoot(pathHint: string = "."): Promise<string | null> {
    if (await fsUtils.existsDir(pathHint)) {
        if (await fsUtils.existsFile(path.join(pathHint, "wproject.json"))) {
            return pathHint;
        }

        return await findRoot(path.join(pathHint, ".."));
    } else {
        return null;
    }
}

export = findRoot;
