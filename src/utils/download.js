/**
 * Triggers a same-origin file download programmatically. Used after a
 * confirm dialog resolves true, since a plain <a download> attribute fires
 * before we'd have a chance to await user confirmation.
 */
export function triggerDownload(href, fileName) {
  const link = document.createElement('a')
  link.href = href
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
