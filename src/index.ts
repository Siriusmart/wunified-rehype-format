import { UntypedProcessor, WUnifiedPlugin } from "wp-unified"
import rehypeFormat from "rehype-format"

export default class WRehypeFormat extends WUnifiedPlugin {
    apply(processor: UntypedProcessor, options: any): UntypedProcessor {
        if (options === undefined)
            return processor.use(rehypeFormat)
        else
            return processor.use(rehypeFormat, options)
    }
}
