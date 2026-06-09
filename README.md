# 🤖 AI Tab Grouper — Chrome Extension

Automatically detects and groups AI-related tabs using Chrome's native Tab Groups feature.

---

## Features

- **Auto-detection** — Recognises 50+ AI domains (ChatGPT, Claude, Gemini, Perplexity, Midjourney, Cursor, HuggingFace, and more)
- **Native tab grouping** — Uses Chrome's built-in Tab Groups API, no third-party UI
- **Live monitoring** — Tabs are grouped the moment they finish loading
- **Manual rescan** — Popup button to scan and group all open AI tabs at once
- **Smart cleanup** — If a tab navigates away from an AI site, it's removed from the group

---

## Installation (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `ai-tab-grouper` folder
5. The extension is now active!

---

## How It Works

| Event | What Happens |
|---|---|
| You open an AI website | Tab is automatically added to the `🤖 AI` group |
| You navigate away from an AI site | Tab is removed from the group |
| You install the extension | All currently open AI tabs are grouped |
| You click "Scan & Group All AI Tabs" | All open AI tabs are grouped immediately |

---

## Supported AI Categories

| Category | Examples |
|---|---|
| Chatbots & Assistants | ChatGPT, Claude, Gemini, Copilot, Meta AI |
| AI Search | Perplexity, Phind, Exa |
| Image & Video Gen | Midjourney, Runway, Pika, Sora, Ideogram |
| Code & Dev AI | Cursor, GitHub Copilot, v0, Bolt, Lovable |
| Writing AI | Jasper, Copy.ai, Grammarly, QuillBot |
| AI Platforms & APIs | OpenAI Platform, Anthropic Console, HuggingFace |
| AI Audio & Voice | ElevenLabs, Suno, Udio |
| AI Research | ArXiv, Papers With Code |
| AI Agents & Automation | n8n, Langchain, Dify |

---

## Adding More Domains

Open `background.js` and add your domain to the `AI_DOMAINS` array:

```js
const AI_DOMAINS = [
  // ...existing domains
  "yournewaidomain.com",
];
```

---

## Permissions Used

| Permission | Reason |
|---|---|
| `tabs` | Read tab URLs and detect AI sites |
| `tabGroups` | Create and manage Chrome tab groups |
| `host_permissions` | Access tab URLs across all sites |

---

Built with Manifest V3 · No data collected · Fully local
