/**
 * renderMentions
 *
 * Post-processes stored message HTML to apply viewer-specific mention styling.
 * Mention spans are stored as:
 *   <span class="mention" data-id="userId" data-label="name">@name</span>
 *
 * At render time we inject a viewer-aware class:
 *   - mention-self  → light yellow background (current viewer is the mentioned user)
 *   - mention-other → light blue background  (someone else is mentioned)
 *
 * Runs on the raw HTML string before DOMPurify so no DOM access is needed.
 */
export function renderMentions(html: string, currentUserId: string | null | undefined): string {
  if (!html) return html;

  // Match any <span ...> tag that contains class="mention"
  return html.replace(/<span([^>]*?)>/g, (fullMatch, attrs) => {
    // Only process mention spans
    if (!/class="mention"/.test(attrs)) return fullMatch;

    // Extract data-id value from the attributes string
    const idMatch = attrs.match(/data-id="([^"]*)"/);
    const dataId = idMatch?.[1] ?? null;

    let extraClass: string;
    if (!currentUserId || !dataId) {
      extraClass = "mention-other";
    } else {
      extraClass = dataId === currentUserId ? "mention-self" : "mention-other";
    }

    // Replace class="mention" with class="mention mention-self/other"
    const newAttrs = attrs.replace('class="mention"', `class="mention ${extraClass}"`);
    return `<span${newAttrs}>`;
  });
}
