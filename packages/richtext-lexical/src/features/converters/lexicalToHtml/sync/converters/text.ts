import type { SerializedTextNode } from '../../../../../nodeTypes.js'
import type { HTMLConverters } from '../types.js'

import { NodeFormat } from '../../../../../lexical/utils/nodeFormat.js'

export const TextHTMLConverter: HTMLConverters<SerializedTextNode> = {
  text: ({ node }) => {
    let text = node.text

    if (node.format & NodeFormat.IS_BOLD) {
      text = `<strong>${text}</strong>`
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      text = `<em>${text}</em>`
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      text = `<span style="text-decoration: line-through;">${text}</span>`
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      text = `<span style="text-decoration: underline;">${text}</span>`
    }
    if (node.format & NodeFormat.IS_CODE) {
      text = `<code>${text}</code>`
    }
    if (node.format & NodeFormat.IS_SUBSCRIPT) {
      text = `<sub>${text}</sub>`
    }
    if (node.format & NodeFormat.IS_SUPERSCRIPT) {
      text = `<sup>${text}</sup>`
    }

    return text
  },
}
