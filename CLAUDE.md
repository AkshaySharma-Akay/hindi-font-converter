# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hindi Font Converter is a client-side web application for bidirectional conversion between Unicode Hindi (Mangal) and Krutidev010 legacy font encoding. All processing happens in the browser - no server uploads.

## Commands

```bash
# Local development - serve from project root
python -m http.server 8000
# Then open http://localhost:8000
```

## Architecture

```
index.html                     # Main HTML - Two-tab UI: Text Converter, File Converter
css/style.css                  # Styles
js/
├── converter.js               # Core conversion: unicodeToKrutidev(), krutidevToUnicode()
└── app.js                     # UI logic, file handling, DOCX & PDF generation
data/mappings.json             # Character mappings (loaded at runtime, fallback embedded)
fonts/NotoSansDevanagari-Regular.ttf  # Bundled font (for local fallback)
input/                         # User input files (gitignored)
output/                        # Generated output files (gitignored)
```

## Key Concepts

- **Krutidev010**: Legacy font mapping ASCII codes to Devanagari glyphs
- **Unicode Hindi**: Standard encoding (e.g., Mangal font)
- **i-matra (ि)**: Appears before consonant in Krutidev, after in Unicode - special handling in `converter.js`
- **Bidirectional**: Both `unicodeToKrutidev()` and `krutidevToUnicode()` are implemented

## Core Functions (js/converter.js)

- `unicodeToKrutidev(text)` - Convert Unicode Hindi to Krutidev encoding
- `krutidevToUnicode(text)` - Convert Krutidev to Unicode Hindi
- `detectFontType(text)` - Returns 'unicode', 'krutidev', 'mixed', or 'other'
- `loadMappings()` - Load mappings from JSON (async, with embedded fallback)

## PDF Generation (js/app.js)

- `getUnicodeTextForPdf()` - Deterministically compute Unicode text at click time
- `formatTextToHtml(text)` - Convert text to HTML preserving line breaks
- `openPrintWindow(unicodeText)` - Open browser print dialog with formatted content
- PDF uses browser print only (no jsPDF/html2canvas) for reliable Hindi rendering

## External Libraries (CDN)

- `mammoth.js` (v1.6.0) - Extract text from DOCX files
- `docx.js` (v8.5.0) - Generate DOCX files

## Privacy

- `input/` and `output/` folders are gitignored (PII protection)
- All processing is client-side (no server uploads)
