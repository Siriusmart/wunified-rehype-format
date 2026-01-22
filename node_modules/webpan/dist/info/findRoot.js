"use strict";
const path = require("path");
const fsUtils = require("../utils/fsUtils");
async function findRoot(pathHint = ".") {
    if (await fsUtils.existsDir(pathHint)) {
        if (await fsUtils.existsFile(path.join(pathHint, "wproject.json"))) {
            return pathHint;
        }
        return await findRoot(path.join(pathHint, ".."));
    }
    else {
        return null;
    }
}
module.exports = findRoot;
//# sourceMappingURL=findRoot.js.map