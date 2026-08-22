# AI Tab Grouper — Chrome Extension

![JavaScript](https://img.shields.io/badge/JavaScript-Chrome%20Extension-yellow)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)

## Table of Contents
- [About](#about)
- [Project Contents](#project-contents)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Permissions](#permissions)
- [Testing](#testing)
- [Contributing](#contributing)
- [Authors and License](#authors-and-license)

## About

AI Tab Grouper is a Chrome browser extension (Manifest V3) that automatically detects tabs pointing at AI-related websites and groups them together using Chrome's native Tab Groups feature. `background.js` maintains a hardcoded `AI_DOMAINS` list of roughly 75 domains (ChatGPT, Claude, Gemini, Perplexity, Midjourney, Cursor, HuggingFace, ElevenLabs, arXiv, and many more, organized by category in comments: chatbots, AI search, image/video generation, code/dev AI, writing AI, AI platforms/APIs, audio/voice, research, and agents/automation). A `chrome.tabs.onUpdated` listener checks each tab's hostname (and path, for path-scoped entries like `github.com/features/copilot`) against that list as pages finish loading, moving matches into a tab group titled "🤖 AI" (cyan) via `chrome.tabs.group`/`chrome.tabGroups.update`, and ungrouping tabs that navigate away from an AI site. `chrome.runtime.onInstalled` does an initial sweep of all open tabs on install/update. The popup (`popup.html` + `popup.js`) shows a live tab count / AI-tab count / group-status pill and a "Scan & Group All AI Tabs" button that messages the background service worker to force a manual rescan. Everything runs locally in the browser with no network calls and no external dependencies.

## Project Contents

```
ai-tab-grouper/
├── manifest.json     # Manifest V3 config (permissions, service worker, popup, icons)
├── background.js     # Service worker: AI_DOMAINS list, tab matching, grouping logic
├── popup.html         # Popup UI markup
├── popup.js           # Popup logic: stats display + manual rescan trigger
└── icons/             # 16px / 48px / 128px extension icons
```

## Prerequisites

- Google Chrome (or another Chromium-based browser that supports Manifest V3 and the `tabGroups` API)
- No build tools, package manager, or external libraries are required — it's plain JS/HTML/JSON.

## Installation

```bash
git clone https://github.com/successjoseph/ai-tab-grouper.git
```

Load it as an unpacked extension:
1. Open `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `ai-tab-grouper` folder

## Configuration

There are no environment variables or settings files. The only "configuration" is the domain list itself — to recognize additional AI sites, edit the `AI_DOMAINS` array directly in `background.js` and reload the extension:
```js
const AI_DOMAINS = [
  // ...existing domains
  "yournewaidomain.com",
];
```

## Usage

Once loaded, the extension works automatically:

| Event | Behavior |
|---|---|
| You open an AI website | The tab is added to the "🤖 AI" tab group (created if it doesn't exist) |
| You navigate away from an AI site | The tab is removed from the AI group |
| You install/update the extension | All currently open AI tabs are grouped immediately |
| You click "Scan & Group All AI Tabs" in the popup | All open AI tabs across all windows are (re)grouped on demand |

## Permissions

| Permission | Reason |
|---|---|
| `tabs` | Read tab URLs to detect AI sites |
| `tabGroups` | Create and manage the native Chrome tab group |
| `host_permissions: <all_urls>` | Needed to inspect the URL of any tab, since AI sites can be on any domain |

## Testing

No automated tests are currently included.

## Contributing

This is a personal browser-utility project. Suggestions for new AI domains or grouping behavior are just a matter of editing `AI_DOMAINS` in `background.js`.

## Authors and License

- **Author:** successjoseph ([github.com/successjoseph](https://github.com/successjoseph))
- **License:** No license file included in this repository — all rights reserved by default.
