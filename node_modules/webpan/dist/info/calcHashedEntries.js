"use strict";
const crypto = require("crypto");
function calcHashedEntries(fsEntries) {
    let hashedEntries = new Map();
    for (const [childPath, fsContent] of fsEntries.entries()) {
        switch (fsContent.content[0]) {
            case "file": {
                let hash = crypto
                    .createHmac("md5", "")
                    .update(fsContent.content[1])
                    .digest("hex");
                hashedEntries.set(childPath, hash);
                break;
            }
            case "dir": {
                hashedEntries.set(childPath, null);
            }
        }
    }
    return hashedEntries;
}
module.exports = calcHashedEntries;
//# sourceMappingURL=calcHashedEntries.js.map