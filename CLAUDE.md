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
docs/js/
├── converter.js               # Core conversion: unicodeToKrutidev(), krutidevToUnicode()
└── app.js                     # UI logic, file handling, DOCX/PDF generation
data/mappings.json             # Character mappings (loaded at runtime, fallback embedded)
fonts/NotoSansDevanagari-Regular.ttf  # Bundled font
input/                         # User files (gitignored)
output/                        # Generated files (gitignored)
```

## Key Concepts

- **Krutidev010**: Legacy font mapping ASCII codes to Devanagari glyphs
- **Unicode Hindi**: Standard encoding (e.g., Mangal font)
- **i-matra (ि)**: Appears before consonant in Krutidev, after in Unicode - special handling in `converter.js`
- **Bidirectional**: Both `unicodeToKrutidev()` and `krutidevToUnicode()` are implemented

## Core Functions (docs/js/converter.js)

- `unicodeToKrutidev(text)` - Convert Unicode Hindi to Krutidev encoding
- `krutidevToUnicode(text)` - Convert Krutidev to Unicode Hindi
- `detectFontType(text)` - Returns 'unicode', 'krutidev', 'mixed', or 'other'
- `loadMappings()` - Load mappings from JSON (async, with embedded fallback)

## External Libraries (CDN)

- `mammoth.js` (v1.6.0) - Extract text from DOCX files
- `docx.js` (v8.5.0) - Generate DOCX files
- `jsPDF` (v2.5.1) - PDF generation
- `html2canvas` (v1.4.1) - HTML to canvas rendering

## Privacy

- `input/` and `output/` folders are gitignored (PII protection)
- All processing is client-side (no server uploads)
