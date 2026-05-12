import { UntypedProcessor, WUnifiedPlugin } from "wp-unified"
import rehypeFormat from "rehype-format"

export default class WRehypeFormat extends WUnifiedPlugin {
    apply(processor: UntypedProcessor, options: any): UntypedProcessor {
        if (options === undefined)
            processor = processor.use(rehypeFormat)
        else
            processor = processor.use(rehypeFormat, options)

        if (options.snapshot === true)
            processor.apply(() => (tree: any) => {
                this.result.content = structuredClone(tree)
            })

        return processor;
    }
}
