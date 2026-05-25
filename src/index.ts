import rehypeFormat from "rehype-format"
import { UntypedProcessor, WUnifiedPlugin } from "wp-unified"

export default class WRehypeFormat extends WUnifiedPlugin {
    apply(processor: UntypedProcessor, options: any): UntypedProcessor {
        if (options === undefined)
            return processor.use(rehypeFormat)
        else
            return processor.use(rehypeFormat, options)
    }
}
