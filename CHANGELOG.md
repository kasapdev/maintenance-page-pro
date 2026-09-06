# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.1] - 2026-09-06

### Fixed

- `js/template.js`: sanitized social link URLs before writing them into the exported/deployed maintenance page. Previously, a pasted `javascript:`, `data:`, `vbscript:`, or `file:` URL in the Social Links section would be embedded verbatim as a live, clickable `href` on the real published site — a script-execution risk for every visitor. Such links are now dropped from the output; ordinary `http(s)`, `mailto:`, and bare-domain links are unaffected.
