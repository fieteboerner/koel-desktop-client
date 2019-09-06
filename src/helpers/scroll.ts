/**
 * Finds the next parent which is scrollable
 *
 * @param {HTMLElement} node
 * @returns {HTMLElement|null}
 */
export const getScrollParent = (node: HTMLElement): HTMLElement|null => {
  if (node == null) {
    return null
  }

  if (node.scrollHeight > node.clientHeight) {
    return node
  } else {
    return getScrollParent(<HTMLElement> node.parentNode)
  }
}
