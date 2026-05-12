"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wp_unified_1 = require("wp-unified");
const rehype_format_1 = __importDefault(require("rehype-format"));
class WRehypeFormat extends wp_unified_1.WUnifiedPlugin {
    apply(processor, options) {
        if (options === undefined)
            return processor.use(rehype_format_1.default);
        else
            return processor.use(rehype_format_1.default, options);
    }
}
exports.default = WRehypeFormat;
//# sourceMappingURL=index.js.map