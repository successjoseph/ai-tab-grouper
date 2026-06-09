// ─────────────────────────────────────────────
//  AI Tab Grouper — Background Service Worker
// ─────────────────────────────────────────────

const AI_DOMAINS = [
  // Chatbots & Assistants
  "chat.openai.com",
  "chatgpt.com",
  "claude.ai",
  "gemini.google.com",
  "bard.google.com",
  "copilot.microsoft.com",
  "bing.com/chat",
  "you.com",
  "poe.com",
  "character.ai",
  "pi.ai",
  "inflection.ai",
  "meta.ai",
  "groq.com",

  // AI Search
  "perplexity.ai",
  "phind.com",
  "kagi.com",
  "exa.ai",

  // Image & Video Generation
  "midjourney.com",
  "ideogram.ai",
  "leonardo.ai",
  "runwayml.com",
  "pika.art",
  "stability.ai",
  "dreamstudio.ai",
  "adobe.com/products/firefly",
  "canva.com",
  "kling.kuaishou.com",
  "haiper.ai",
  "sora.com",

  // Code & Dev AI
  "github.com/features/copilot",
  "cursor.sh",
  "cursor.com",
  "replit.com",
  "codeium.com",
  "tabnine.com",
  "v0.dev",
  "bolt.new",
  "lovable.dev",
  "stackblitz.com",

  // Writing & Productivity AI
  "notion.so",
  "jasper.ai",
  "copy.ai",
  "writesonic.com",
  "grammarly.com",
  "quillbot.com",
  "rytr.me",
  "hyperwriteai.com",

  // AI Platforms & APIs
  "platform.openai.com",
  "console.anthropic.com",
  "aistudio.google.com",
  "huggingface.co",
  "replicate.com",
  "together.ai",
  "fireworks.ai",
  "mistral.ai",
  "cohere.com",
  "ai.meta.com",
  "deepmind.google",
  "openrouter.ai",

  // AI Audio & Voice
  "elevenlabs.io",
  "murf.ai",
  "suno.ai",
  "udio.com",
  "lovo.ai",

  // AI Research
  "arxiv.org",
  "semanticscholar.org",
  "paperswithcode.com",

  // AI Tools & Agents
  "zapier.com/ai",
  "make.com",
  "n8n.io",
  "langchain.com",
  "flowise.ai",
  "dify.ai",
  "agentgpt.reworkd.ai",
];

const GROUP_TITLE = "🤖 AI";
const GROUP_COLOR = "cyan"; // Chrome tab group color

// ─── Helpers ──────────────────────────────────

/**
 * Check whether a tab's URL matches any known AI domain.
 */
function isAiTab(url) {
  if (!url || url.startsWith("chrome://") || url.startsWith("chrome-extension://")) {
    return false;
  }

  try {
    const { hostname, pathname } = new URL(url);
    const fullPath = hostname + pathname;

    return AI_DOMAINS.some((domain) => {
      // Handle path-based entries like "adobe.com/products/firefly"
      if (domain.includes("/")) {
        return fullPath.startsWith(domain) || fullPath.startsWith("www." + domain);
      }
      return hostname === domain || hostname === "www." + domain || hostname.endsWith("." + domain);
    });
  } catch {
    return false;
  }
}

/**
 * Find an existing AI group in a given window, or return null.
 */
async function findAiGroup(windowId) {
  const groups = await chrome.tabGroups.query({ windowId });
  return groups.find((g) => g.title === GROUP_TITLE) ?? null;
}

/**
 * Move a tab into the AI group, creating the group if it doesn't exist.
 */
async function addTabToAiGroup(tab) {
  const windowId = tab.windowId;
  let group = await findAiGroup(windowId);

  if (group) {
    // Group already exists — just move the tab into it
    await chrome.tabs.group({ tabIds: [tab.id], groupId: group.id });
  } else {
    // Create a new group with this tab
    const groupId = await chrome.tabs.group({ tabIds: [tab.id] });
    await chrome.tabGroups.update(groupId, {
      title: GROUP_TITLE,
      color: GROUP_COLOR,
    });
  }
}

/**
 * Remove a tab from any group (e.g. when it navigates away from an AI site).
 */
async function removeTabFromGroup(tabId) {
  try {
    await chrome.tabs.ungroup([tabId]);
  } catch {
    // Tab may already be ungrouped — safe to ignore
  }
}

// ─── Event Listeners ──────────────────────────

/**
 * Fire whenever a tab finishes loading or its URL changes.
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url) return;

  if (isAiTab(tab.url)) {
    await addTabToAiGroup(tab);
  } else if (changeInfo.url && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
    // Tab navigated away from an AI site AND was in a group
    const group = await chrome.tabGroups.get(tab.groupId).catch(() => null);
    if (group?.title === GROUP_TITLE) {
      await removeTabFromGroup(tabId);
    }
  }
});

/**
 * When the extension is installed/updated, scan all open tabs and group any AI ones.
 */
chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.url && isAiTab(tab.url)) {
      await addTabToAiGroup(tab);
    }
  }
});

/**
 * Message handler — lets the popup trigger a manual re-scan.
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "rescan") {
    (async () => {
      const tabs = await chrome.tabs.query({});
      let grouped = 0;
      for (const tab of tabs) {
        if (tab.url && isAiTab(tab.url)) {
          await addTabToAiGroup(tab);
          grouped++;
        }
      }
      sendResponse({ success: true, grouped });
    })();
    return true; // keep message channel open for async response
  }

  if (message.action === "getStats") {
    (async () => {
      const tabs = await chrome.tabs.query({});
      const aiTabs = tabs.filter((t) => t.url && isAiTab(t.url));
      const groups = await chrome.tabGroups.query({});
      const aiGroup = groups.find((g) => g.title === GROUP_TITLE);
      sendResponse({
        totalTabs: tabs.length,
        aiTabs: aiTabs.length,
        hasGroup: !!aiGroup,
        groupColor: aiGroup?.color ?? null,
      });
    })();
    return true;
  }
});
