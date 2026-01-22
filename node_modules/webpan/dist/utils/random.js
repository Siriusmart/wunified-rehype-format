"use strict";
const crypto = require("crypto");
function hexString(length = 8, constraint) {
    let toTest = crypto.randomBytes(length).toString("hex");
    if (constraint(toTest)) {
        return toTest;
    }
    else {
        return hexString(length, constraint);
    }
}
module.exports = {
    hexString,
};
//# sourceMappingURL=random.js.map