# Hindi Font Converter

A client-side web application for bidirectional conversion between **Unicode Hindi (Mangal)** and **Krutidev010** legacy font encoding.

## What is Krutidev?

Krutidev010 is a legacy Hindi font that maps ASCII character codes to Devanagari glyphs. It was widely used in Indian government offices, newspapers, and publishing before Unicode adoption. Many legacy documents still use this encoding.

## Features

- **Bidirectional Conversion**: Convert text from Unicode to Krutidev and vice versa
- **Text Converter**: Paste or type Hindi text for instant conversion
- **File Converter**: Upload DOCX files and convert entire documents
- **Multiple Export Formats**: Download converted files as DOCX or PDF
- **Font Preview**: Preview Krutidev output with proper font rendering
- **Privacy-First**: All processing happens in your browser - no data is uploaded to any server

## How to Use

### Local Development

```bash
# Serve from project root
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Text Conversion

1. Open the application in your browser
2. Select the "Text Converter" tab
3. Paste or type your Hindi text in the input area
4. Click the swap button to change conversion direction (Unicode → Krutidev or Krutidev → Unicode)
5. Click "Convert" to see the result
6. Copy the output using the copy button

### File Conversion

1. Select the "File Converter" tab
2. Choose conversion direction from the dropdown
3. Drag and drop a DOCX file or click to browse
4. Click "Convert File"
5. Download the result as DOCX or PDF

## Technical Details

### Core Functions

| Function | Description |
|----------|-------------|
| `unicodeToKrutidev(text)` | Convert Unicode Hindi to Krutidev encoding |
| `krutidevToUnicode(text)` | Convert Krutidev to Unicode Hindi |
| `detectFontType(text)` | Detect encoding type: 'unicode', 'krutidev', 'mixed', or 'other' |

### Special Handling

- **i-matra (ि)**: In Krutidev, the "i" matra appears before the consonant, while in Unicode it comes after. The converter handles this repositioning automatically.
- **Half Letters & Conjuncts**: Special character combinations are mapped correctly between encodings.

### Project Structure

```
index.html                    # Main UI with two tabs
css/style.css                 # Styles
js/
├── converter.js              # Core conversion logic
└── app.js                    # UI logic and file handling
data/mappings.json            # Character mappings (loaded at runtime)
fonts/                        # Bundled fonts
```

### External Libraries

- [mammoth.js](https://github.com/mwilliamson/mammoth.js) - Extract text from DOCX files
- [docx.js](https://github.com/dolanmiu/docx) - Generate DOCX files
- [html2canvas](https://html2canvas.hertzen.com/) - HTML to canvas rendering

## Limitations

- Conversion may not be 100% accurate for all character combinations.
- Some special characters or rare conjuncts may not convert correctly.
- For best Krutidev preview, install "Kruti Dev 010" font on your system.