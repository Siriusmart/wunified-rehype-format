import rehypeFormat from "rehype-format";
import { WUnifiedPlugin } from "wp-unified";
export default class WRehypeFormat extends WUnifiedPlugin {
    apply(processor, options) {
        if (options === undefined)
            return processor.use(rehypeFormat);
        else
            return processor.use(rehypeFormat, options);
    }
}
//# sourceMappingURL=index.js.map