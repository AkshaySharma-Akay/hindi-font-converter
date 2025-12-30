/**
 * Hindi Font Converter - Main Application
 * Handles UI interactions, file processing, and document generation
 */

// ============================================
// STATE
// ============================================
let currentDirection = 'u2k'; // 'u2k' = Unicode to Krutidev, 'k2u' = Krutidev to Unicode
let currentFile = null;
let convertedText = '';
let originalText = '';
let unicodeText = ''; // Store Unicode text for PDF generation

// ============================================
// DOM ELEMENTS
// ============================================

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.section');

// Text Converter
const sourceLabel = document.getElementById('source-label');
const targetLabel = document.getElementById('target-label');
const swapDirectionBtn = document.getElementById('swap-direction');
const inputPanelTitle = document.getElementById('input-panel-title');
const outputPanelTitle = document.getElementById('output-panel-title');
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const inputCount = document.getElementById('input-count');
const outputCount = document.getElementById('output-count');
const clearInputBtn = document.getElementById('clear-input');
const pasteBtn = document.getElementById('paste-btn');
const copyOutputBtn = document.getElementById('copy-output');
const useAsInputBtn = document.getElementById('use-as-input');
const convertBtn = document.getElementById('convert-btn');
const textStatus = document.getElementById('text-status');
const krutidevPreview = document.getElementById('krutidev-preview');

// File Converter
const fileDirection = document.getElementById('file-direction');
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const fileSelected = document.getElementById('file-selected');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');
const removeFileBtn = document.getElementById('remove-file');
const convertFileBtn = document.getElementById('convert-file-btn');
const fileStatus = document.getElementById('file-status');
const downloadSection = document.getElementById('download-section');
const downloadDocxBtn = document.getElementById('download-docx');
const downloadPdfBtn = document.getElementById('download-pdf');
const filePreview = document.getElementById('file-preview');

// ============================================
// TAB NAVIGATION
// ============================================
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${tabId}-section`) {
                section.classList.add('active');
            }
        });
    });
});

// ============================================
// TEXT CONVERTER
// ============================================

function updateDirectionUI() {
    if (currentDirection === 'u2k') {
        sourceLabel.innerHTML = '<span class="label-icon">🔤</span><span>यूनिकोड हिंदी</span>';
        targetLabel.innerHTML = '<span class="label-icon">🔡</span><span>कृतिदेव010</span>';
        inputPanelTitle.textContent = 'इनपुट (यूनिकोड)';
        outputPanelTitle.textContent = 'आउटपुट (कृतिदेव)';
        inputText.placeholder = 'यहाँ अपना हिंदी टेक्स्ट टाइप या पेस्ट करें...\n\nउदाहरण: नमस्ते भारत';
    } else {
        sourceLabel.innerHTML = '<span class="label-icon">🔡</span><span>कृतिदेव010</span>';
        targetLabel.innerHTML = '<span class="label-icon">🔤</span><span>यूनिकोड हिंदी</span>';
        inputPanelTitle.textContent = 'इनपुट (कृतिदेव)';
        outputPanelTitle.textContent = 'आउटपुट (यूनिकोड)';
        inputText.placeholder = 'यहाँ अपना कृतिदेव टेक्स्ट टाइप या पेस्ट करें...\n\nउदाहरण: ueLrs Hkkjr';
    }
}

function updateCharCounts() {
    inputCount.textContent = `${inputText.value.length} अक्षर`;
    outputCount.textContent = `${outputText.value.length} अक्षर`;
}

function convertText() {
    const input = inputText.value;

    if (!input.trim()) {
        outputText.value = '';
        krutidevPreview.textContent = 'कन्वर्ट करने के बाद प्रीव्यू यहाँ दिखेगा...';
        updateCharCounts();
        return;
    }

    try {
        let result;
        if (currentDirection === 'u2k') {
            result = unicodeToKrutidev(input);
            krutidevPreview.textContent = result;
        } else {
            result = krutidevToUnicode(input);
            krutidevPreview.textContent = input; // Show original Krutidev
        }

        outputText.value = result;
        updateCharCounts();
        showStatus(textStatus, '✓ सफलतापूर्वक कन्वर्ट हुआ', 'success');
    } catch (error) {
        showStatus(textStatus, '✕ त्रुटि: ' + error.message, 'error');
    }
}

// Swap Direction
swapDirectionBtn.addEventListener('click', () => {
    currentDirection = currentDirection === 'u2k' ? 'k2u' : 'u2k';
    updateDirectionUI();

    // Swap text content
    const temp = inputText.value;
    inputText.value = outputText.value;
    outputText.value = temp;

    if (inputText.value) {
        convertText();
    }
});

// Convert Button
convertBtn.addEventListener('click', convertText);

// Auto-convert on input (debounced)
inputText.addEventListener('input', debounce(() => {
    convertText();
}, 300));

// Clear Input
clearInputBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    krutidevPreview.textContent = 'कन्वर्ट करने के बाद प्रीव्यू यहाँ दिखेगा...';
    updateCharCounts();
    hideStatus(textStatus);
});

// Paste from Clipboard
pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        inputText.value = text;
        convertText();
    } catch (error) {
        showStatus(textStatus, '✕ क्लिपबोर्ड से पेस्ट नहीं हो सका', 'error');
    }
});

// Copy Output
copyOutputBtn.addEventListener('click', async () => {
    if (!outputText.value) {
        showStatus(textStatus, '✕ कॉपी करने के लिए कुछ नहीं', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(outputText.value);
        showStatus(textStatus, '✓ क्लिपबोर्ड में कॉपी हो गया!', 'success');
    } catch (error) {
        // Fallback
        outputText.select();
        document.execCommand('copy');
        showStatus(textStatus, '✓ क्लिपबोर्ड में कॉपी हो गया!', 'success');
    }
});

// Use Output as Input
useAsInputBtn.addEventListener('click', () => {
    if (!outputText.value) return;

    currentDirection = currentDirection === 'u2k' ? 'k2u' : 'u2k';
    updateDirectionUI();

    inputText.value = outputText.value;
    outputText.value = '';
    convertText();
});

// ============================================
// FILE CONVERTER
// ============================================

// Upload Zone Click
uploadZone.addEventListener('click', () => fileInput.click());

// Drag and Drop
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
    }
});

// File Input Change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Remove File
removeFileBtn.addEventListener('click', resetFileUpload);

function handleFileSelect(file) {
    if (!file.name.toLowerCase().endsWith('.docx')) {
        showStatus(fileStatus, '✕ कृपया .docx फ़ाइल चुनें', 'error');
        return;
    }

    currentFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    uploadZone.style.display = 'none';
    fileSelected.style.display = 'flex';
    convertFileBtn.disabled = false;
    downloadSection.style.display = 'none';
    hideStatus(fileStatus);

    // Preview file content
    previewFile(file);
}

async function previewFile(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        originalText = result.value;

        const preview = originalText.substring(0, 5000);
        filePreview.innerHTML = `<pre>${escapeHtml(preview)}${originalText.length > 5000 ? '\n\n... (छोटा किया गया)' : ''}</pre>`;
    } catch (error) {
        filePreview.innerHTML = `<p class="placeholder">फ़ाइल पढ़ने में त्रुटि: ${error.message}</p>`;
    }
}

function resetFileUpload() {
    currentFile = null;
    convertedText = '';
    originalText = '';
    fileInput.value = '';

    uploadZone.style.display = 'block';
    fileSelected.style.display = 'none';
    convertFileBtn.disabled = true;
    downloadSection.style.display = 'none';
    hideStatus(fileStatus);
    filePreview.innerHTML = '<p class="placeholder">प्रीव्यू देखने के लिए फ़ाइल अपलोड करें...</p>';
}

// Convert File
convertFileBtn.addEventListener('click', async () => {
    if (!currentFile) return;

    showStatus(fileStatus, '⏳ फ़ाइल कन्वर्ट हो रही है...', 'processing');
    convertFileBtn.disabled = true;

    try {
        const arrayBuffer = await currentFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        originalText = result.value;

        // Convert based on direction
        const direction = fileDirection.value;
        if (direction === 'u2k') {
            convertedText = unicodeToKrutidev(originalText);
            unicodeText = originalText; // Store original Unicode for PDF
        } else {
            convertedText = krutidevToUnicode(originalText);
            unicodeText = convertedText; // Converted text is Unicode
        }

        // Update preview
        const preview = convertedText.substring(0, 5000);
        filePreview.innerHTML = `<pre>${escapeHtml(preview)}${convertedText.length > 5000 ? '\n\n... (छोटा किया गया)' : ''}</pre>`;

        showStatus(fileStatus, '✓ फ़ाइल सफलतापूर्वक कन्वर्ट हुई!', 'success');
        downloadSection.style.display = 'block';
    } catch (error) {
        showStatus(fileStatus, '✕ त्रुटि: ' + error.message, 'error');
    } finally {
        convertFileBtn.disabled = false;
    }
});

// Download DOCX
downloadDocxBtn.addEventListener('click', async () => {
    if (!convertedText) return;

    try {
        showStatus(fileStatus, '⏳ DOCX बन रही है...', 'processing');

        const { Document, Paragraph, TextRun, Packer } = docx;
        const direction = fileDirection.value;
        const fontName = direction === 'u2k' ? 'Kruti Dev 010' : 'Mangal';

        // Split into paragraphs
        const paragraphs = convertedText.split('\n').map(text =>
            new Paragraph({
                children: [
                    new TextRun({
                        text: text,
                        font: fontName,
                        size: 24,
                    }),
                ],
            })
        );

        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs,
            }],
        });

        const blob = await Packer.toBlob(doc);
        downloadBlob(blob, getOutputFilename('.docx'));
        showStatus(fileStatus, '✓ DOCX डाउनलोड हो गई!', 'success');
    } catch (error) {
        showStatus(fileStatus, '✕ DOCX बनाने में त्रुटि: ' + error.message, 'error');
    }
});

// Download PDF using browser's native print dialog (most reliable for Hindi)
downloadPdfBtn.addEventListener('click', () => {
    if (!unicodeText && !convertedText) return;

    const textForPdf = unicodeText || convertedText;

    // Format paragraphs
    const paragraphsHtml = textForPdf
        .replace(/\r\n/g, '\n')
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => `<p>${escapeHtml(p)}</p>`)
        .join('');

    // Open new window with formatted content
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        showStatus(fileStatus, '✕ पॉपअप ब्लॉक हो गया। कृपया पॉपअप अनुमति दें।', 'error');
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="hi">
        <head>
            <meta charset="UTF-8">
            <title>${getOutputFilename('.pdf')}</title>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500&display=swap" rel="stylesheet">
            <style>
                @page {
                    size: A4;
                    margin: 20mm;
                }
                body {
                    font-family: 'Noto Sans Devanagari', 'Mangal', sans-serif;
                    font-size: 14px;
                    line-height: 1.8;
                    color: #000;
                    background: #fff;
                    margin: 0;
                    padding: 40px;
                }
                p {
                    margin: 0 0 1em 0;
                    text-align: justify;
                }
                @media print {
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            ${paragraphsHtml}
            <script>
                // Wait for fonts to load, then print
                document.fonts.ready.then(() => {
                    setTimeout(() => {
                        window.print();
                    }, 500);
                });
            </script>
        </body>
        </html>
    `);

    printWindow.document.close();
    showStatus(fileStatus, '✓ प्रिंट डायलॉग खुला। "PDF में सेव करें" चुनें।', 'success');
});


// ============================================
// UTILITY FUNCTIONS
// ============================================

function showStatus(element, message, type) {
    element.textContent = message;
    element.className = 'status show ' + type;
}

function hideStatus(element) {
    element.classList.remove('show');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getOutputFilename(extension) {
    if (!currentFile) return 'converted' + extension;
    const baseName = currentFile.name.replace(/\.docx$/i, '');
    const suffix = fileDirection.value === 'u2k' ? '_krutidev' : '_unicode';
    return baseName + suffix + extension;
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// INITIALIZATION
// ============================================
updateDirectionUI();
updateCharCounts();
