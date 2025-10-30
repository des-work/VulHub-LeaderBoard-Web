# Community Forum

A built-in forum for students to create topics, tag Vulhub challenges, and engage via likes, upvotes, and comments.

## Pages
- `/community` – Topic list with search/sort and New Topic modal

## Features
- Create Topic: title, content, and one or more Vulhub challenge tags (e.g., `langflow/CVE-2025-3248`)
- Comments: threaded discussion with tags
- Interactions: Upvote and Like for topics and comments
- Search: free-text across titles, content, and tags. Sort by Active/New/Top

## Tagging
- Use the official Vulhub path (from the repo) for consistency
- Tag chips are clickable with links to the corresponding path in GitHub

## Storage & Extensibility
- LocalStorage-backed for quick prototyping
- Replace with backend API for persistence, moderation, and reporting
