import { remark } from 'remark'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

const processor = remark()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeSanitize)
  .use(rehypeStringify)

export const renderMarkdown = (value?: string | null): string => {
  if (!value) {
    return ''
  }

  return String(processor.processSync(value))
}
