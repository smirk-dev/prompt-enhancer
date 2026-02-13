# Privacy Policy - Magic Sparkle Prompt Engine

**Last updated:** February 13, 2026

## Overview

Magic Sparkle Prompt Engine is a browser extension that enriches prompts on supported LLM platforms (ChatGPT, Claude, Gemini). This privacy policy explains how the extension handles your data.

## Data Collection

**Magic Sparkle does not collect, store, transmit, or share any user data.**

Specifically:

- **No personal information** is collected (name, email, IP address, etc.)
- **No browsing history** is tracked or recorded
- **No analytics or telemetry** is sent to any server
- **No cookies** are set by the extension
- **No accounts** are required to use the extension

## How the Extension Works

All processing happens **entirely on your device**:

1. When you focus on a text input on a supported LLM platform, the extension reads the current page's title, URL, and visible text content.
2. This page context is used **locally** to enrich your prompt using the built-in Behemoth Pipeline.
3. The enriched prompt is injected back into the text input on the same page.

**No data ever leaves your browser.** There are no external API calls, no remote servers, and no cloud processing.

## Permissions Explained

| Permission | Why It's Needed |
|-----------|-----------------|
| `activeTab` | To read page content and inject the enhanced prompt on the current tab |
| `storage` | To save your extension preferences locally in your browser |

## Host Permissions

The extension only activates on these specific sites:

- `https://chat.openai.com/*`
- `https://chatgpt.com/*`
- `https://claude.ai/*`
- `https://gemini.google.com/*`

It does not run on any other websites.

## Third-Party Services

This extension does not integrate with, send data to, or receive data from any third-party services.

## Changes to This Policy

If this privacy policy is updated, the changes will be posted in the extension's GitHub repository. The "Last updated" date at the top will reflect the most recent revision.

## Contact

If you have questions about this privacy policy, please open an issue at:
https://github.com/smirk-dev/prompt-enhancer/issues
