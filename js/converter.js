/**
 * Hindi Font Converter - Unicode <-> Krutidev010 bidirectional conversion
 *
 * Krutidev010 is a legacy Hindi font using ASCII character codes mapped to Devanagari glyphs.
 * Mappings are loaded from data/mappings.json for easy customization and reuse.
 */

// Mappings loaded from JSON
let MAPPINGS = null;

// Forward mappings (Unicode to Krutidev)
let VOWELS_U2K = {};
let CONSONANTS_U2K = {};
let MATRAS_U2K = {};
let NUMBERS_U2K = {};
let PUNCTUATION_U2K = {};
let HALF_LETTERS_U2K = {};
let SPECIAL_CONJUNCTS_U2K = {};

// Reverse mappings (Krutidev to Unicode)
let VOWELS_K2U = {};
let CONSONANTS_K2U = {};
let MATRAS_K2U = {};
let NUMBERS_K2U = {};
let PUNCTUATION_K2U = {};
let HALF_LETTERS_K2U = {};
let SPECIAL_CONJUNCTS_K2U = {};

// Special characters
let HALANT = '\u094D';
let HALANT_KRUTIDEV = '~';
let NUKTA = '\u093C';

// Flag to track if mappings are loaded
let mappingsLoaded = false;
let mappingsLoadPromise = null;

/**
 * Load mappings from JSON file
 * @returns {Promise} - Resolves when mappings are loaded
 */
async function loadMappings() {
    if (mappingsLoaded) return;
    if (mappingsLoadPromise) return mappingsLoadPromise;

    mappingsLoadPromise = fetch('data/mappings.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load mappings');
            return response.json();
        })
        .then(data => {
            MAPPINGS = data;
            initializeMappings(data);
            mappingsLoaded = true;
        })
        .catch(error => {
            console.warn('Could not load mappings.json, using embedded mappings:', error);
            useEmbeddedMappings();
            mappingsLoaded = true;
        });

    return mappingsLoadPromise;
}

/**
 * Initialize mappings from loaded JSON data
 * @param {Object} data - Loaded JSON mappings
 */
function initializeMappings(data) {
    VOWELS_U2K = data.vowels || {};
    CONSONANTS_U2K = data.consonants || {};
    MATRAS_U2K = data.matras || {};
    NUMBERS_U2K = data.numbers || {};
    PUNCTUATION_U2K = data.punctuation || {};
    HALF_LETTERS_U2K = data.halfLetters || {};
    SPECIAL_CONJUNCTS_U2K = data.specialConjuncts || {};

    // Set special characters
    if (data.special) {
        HALANT = data.special.halant?.unicode || '\u094D';
        HALANT_KRUTIDEV = data.special.halant?.krutidev || '~';
        NUKTA = data.special.nukta?.unicode || '\u093C';
    }

    // Build reverse mappings
    buildReverseMappings();
}

/**
 * Fallback embedded mappings if JSON fails to load
 */
function useEmbeddedMappings() {
    VOWELS_U2K = {
        '\u0905': 'v', '\u0906': 'vk', '\u0907': 'b', '\u0908': 'bZ',
        '\u0909': 'm', '\u090A': 'Å', '\u090B': '_', '\u090F': ',',
        '\u0910': ',s', '\u0913': 'vks', '\u0914': 'vkS'
    };

    CONSONANTS_U2K = {
        '\u0915': 'd', '\u0916': '[k', '\u0917': 'x', '\u0918': '?k',
        '\u0919': '³', '\u091A': 'p', '\u091B': 'N', '\u091C': 't',
        '\u091D': '>', '\u091E': '×', '\u091F': 'V', '\u0920': 'B',
        '\u0921': 'M', '\u0922': '<', '\u0923': '.k', '\u0924': 'r',
        '\u0925': 'Fk', '\u0926': 'n', '\u0927': '/k', '\u0928': 'u',
        '\u092A': 'i', '\u092B': 'Q', '\u092C': 'c', '\u092D': 'Hk',
        '\u092E': 'e', '\u092F': ';', '\u0930': 'j', '\u0932': 'y',
        '\u0935': 'o', '\u0936': "'k", '\u0937': '"k', '\u0938': 'l',
        '\u0939': 'g', '\u0933': 'G'
    };

    MATRAS_U2K = {
        '\u093E': 'k', '\u093F': 'f', '\u0940': 'h', '\u0941': 'q',
        '\u0942': 'w', '\u0943': '`', '\u0947': 's', '\u0948': 'S',
        '\u094B': 'ks', '\u094C': 'kS', '\u0902': 'a', '\u0903': '%',
        '\u0901': 'aW'
    };

    NUMBERS_U2K = {
        '\u0966': '0', '\u0967': '1', '\u0968': '2', '\u0969': '3',
        '\u096A': '4', '\u096B': '5', '\u096C': '6', '\u096D': '7',
        '\u096E': '8', '\u096F': '9'
    };

    PUNCTUATION_U2K = { '\u0964': 'A', '\u0965': 'AA' };

    HALF_LETTERS_U2K = {
        '\u0915\u094D': 'D', '\u0916\u094D': '[', '\u0917\u094D': 'X',
        '\u0918\u094D': '?', '\u091A\u094D': 'P', '\u091C\u094D': 'T',
        '\u091F\u094D': 'ê', '\u0920\u094D': 'ë', '\u0921\u094D': 'ì',
        '\u0924\u094D': 'R', '\u0925\u094D': 'F', '\u0926\u094D': 'í',
        '\u0927\u094D': '/', '\u0928\u094D': 'U', '\u092A\u094D': 'I',
        '\u092C\u094D': 'C', '\u092D\u094D': 'H', '\u092E\u094D': 'E',
        '\u0930\u094D': 'Z', '\u0932\u094D': 'Y', '\u0935\u094D': 'O',
        '\u0936\u094D': "'", '\u0937\u094D': '"', '\u0938\u094D': 'L',
        '\u0939\u094D': 'à'
    };

    SPECIAL_CONJUNCTS_U2K = {
        '\u0915\u094D\u0937': '{k', '\u0924\u094D\u0930': '=',
        '\u091C\u094D\u091E': 'K', '\u0936\u094D\u0930': 'J',
        '\u0915\u094D\u0930': 'Ø', '\u092A\u094D\u0930': 'iz',
        '\u0926\u094D\u0930': 'æ', '\u0917\u094D\u0930': 'xz',
        '\u092C\u094D\u0930': 'cz', '\u092D\u094D\u0930': 'Hkz',
        '\u0938\u094D\u0924': 'Lr', '\u0938\u094D\u0925': 'LFk',
        '\u0938\u094D\u0935': 'Lo', '\u0928\u094D\u0924': 'Ur',
        '\u0928\u094D\u0926': 'Un', '\u0928\u094D\u0927': 'U/',
        '\u0928\u094D\u0928': 'Uu', '\u0928\u094D\u092F': 'U;',
        '\u0932\u094D\u0932': 'Yy', '\u0937\u094D\u091F': '"V',
        '\u0937\u094D\u0920': '"B', '\u0926\u094D\u0935': 'í}',
        '\u0926\u094D\u0927': 'í/', '\u0915\u094D\u0924': 'Dr',
        '\u0939\u094D\u092F': 'á', '\u0939\u094D\u0928': 'àu',
        '\u0939\u094D\u0935': 'ào', '\u0939\u094D\u0932': 'ày',
        '\u0939\u094D\u0930': 'àz', '\u0926\u094D\u092F': 'í;',
        '\u091A\u094D\u091B': 'PN', '\u0915\u094D\u0915': 'Dd'
    };

    buildReverseMappings();
}

/**
 * Build reverse mappings for Krutidev to Unicode conversion
 */
function buildReverseMappings() {
    VOWELS_K2U = {};
    CONSONANTS_K2U = {};
    MATRAS_K2U = {};
    NUMBERS_K2U = {};
    PUNCTUATION_K2U = {};
    HALF_LETTERS_K2U = {};
    SPECIAL_CONJUNCTS_K2U = {};

    for (const [k, v] of Object.entries(SPECIAL_CONJUNCTS_U2K)) {
        SPECIAL_CONJUNCTS_K2U[v] = k;
    }
    for (const [k, v] of Object.entries(HALF_LETTERS_U2K)) {
        HALF_LETTERS_K2U[v] = k;
    }
    for (const [k, v] of Object.entries(CONSONANTS_U2K)) {
        CONSONANTS_K2U[v] = k;
    }
    for (const [k, v] of Object.entries(VOWELS_U2K)) {
        VOWELS_K2U[v] = k;
    }
    for (const [k, v] of Object.entries(MATRAS_U2K)) {
        MATRAS_K2U[v] = k;
    }
    for (const [k, v] of Object.entries(NUMBERS_U2K)) {
        NUMBERS_K2U[v] = k;
    }
    for (const [k, v] of Object.entries(PUNCTUATION_U2K)) {
        PUNCTUATION_K2U[v] = k;
    }
}

/**
 * Convert Unicode Hindi text to Krutidev010 encoding
 * @param {string} text - Unicode Hindi text
 * @returns {string} - Krutidev010 encoded text
 */
function unicodeToKrutidev(text) {
    if (!text) return text;

    const result = [];
    let i = 0;
    const n = text.length;

    while (i < n) {
        let matched = false;

        // Try matching special conjuncts (3-4 chars)
        for (let length = Math.min(4, n - i); length > 2; length--) {
            const seq = text.substring(i, i + length);
            if (SPECIAL_CONJUNCTS_U2K[seq]) {
                result.push(SPECIAL_CONJUNCTS_U2K[seq]);
                i += length;
                matched = true;
                break;
            }
        }

        if (matched) continue;

        // Try matching half letters (2 chars: consonant + halant)
        if (i + 1 < n) {
            const seq = text.substring(i, i + 2);
            if (HALF_LETTERS_U2K[seq]) {
                result.push(HALF_LETTERS_U2K[seq]);
                i += 2;
                continue;
            }
        }

        const char = text[i];

        // Handle single characters
        if (VOWELS_U2K[char]) {
            result.push(VOWELS_U2K[char]);
        } else if (CONSONANTS_U2K[char]) {
            result.push(CONSONANTS_U2K[char]);
        } else if (MATRAS_U2K[char]) {
            // Special handling for i matra (ि) - placed before consonant in Krutidev
            if (char === '\u093F' && result.length > 0) {
                const matra = MATRAS_U2K[char];
                result.splice(result.length - 1, 0, matra);
            } else {
                result.push(MATRAS_U2K[char]);
            }
        } else if (char === HALANT) {
            result.push(HALANT_KRUTIDEV);
        } else if (NUMBERS_U2K[char]) {
            result.push(NUMBERS_U2K[char]);
        } else if (PUNCTUATION_U2K[char]) {
            result.push(PUNCTUATION_U2K[char]);
        } else if (char === NUKTA) {
            // Skip nukta for now
        } else {
            result.push(char);
        }

        i++;
    }

    return result.join('');
}

/**
 * Convert Krutidev010 encoded text to Unicode Hindi
 * @param {string} text - Krutidev010 encoded text
 * @returns {string} - Unicode Hindi text
 */
function krutidevToUnicode(text) {
    if (!text) return text;

    // Sort keys by length (longest first) for proper matching
    const allMappings = [
        ...Object.entries(SPECIAL_CONJUNCTS_K2U),
        ...Object.entries(HALF_LETTERS_K2U),
        ...Object.entries(CONSONANTS_K2U),
        ...Object.entries(VOWELS_K2U),
        ...Object.entries(MATRAS_K2U),
        ...Object.entries(NUMBERS_K2U),
        ...Object.entries(PUNCTUATION_K2U),
        [HALANT_KRUTIDEV, HALANT],
    ].sort((a, b) => b[0].length - a[0].length);

    let result = text;

    // First, do simple replacements for multi-char sequences
    for (const [krutidev, unicode] of allMappings) {
        if (krutidev.length > 1) {
            result = result.split(krutidev).join(unicode);
        }
    }

    // Then handle single character replacements
    let output = [];
    let i = 0;
    while (i < result.length) {
        const char = result[i];
        let found = false;

        // Check if this is 'f' (i-matra) followed by a consonant
        if (char === 'f' && i + 1 < result.length) {
            const nextChar = result[i + 1];
            // Check if next char maps to a consonant
            if (CONSONANTS_K2U[nextChar]) {
                output.push(CONSONANTS_K2U[nextChar]);
                output.push('\u093F'); // ि
                i += 2;
                continue;
            }
        }

        // Check single char mappings
        for (const [krutidev, unicode] of allMappings) {
            if (krutidev.length === 1 && char === krutidev) {
                output.push(unicode);
                found = true;
                break;
            }
        }

        if (!found) {
            output.push(char);
        }
        i++;
    }

    return output.join('');
}

/**
 * Detect the type of text encoding
 * @param {string} text - Input text
 * @returns {string} - 'unicode', 'krutidev', 'mixed', or 'other'
 */
function detectFontType(text) {
    const hasUnicode = /[\u0900-\u097F]/.test(text);
    const krutidevPatterns = ['vk', 'bZ', ';k', 'gS', 'fd', 'dk', 'ds', 'dh', 'Fkk', 'esa'];
    const hasKrutidev = krutidevPatterns.some(pattern => text.includes(pattern));

    if (hasUnicode && hasKrutidev) return 'mixed';
    if (hasUnicode) return 'unicode';
    if (hasKrutidev) return 'krutidev';
    return 'other';
}

/**
 * Get current mappings data (for debugging/display)
 * @returns {Object} - Current mappings object
 */
function getMappings() {
    return MAPPINGS;
}

// Initialize with embedded mappings immediately (will be overwritten if JSON loads)
useEmbeddedMappings();

// Try to load JSON mappings
loadMappings().catch(console.error);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { unicodeToKrutidev, krutidevToUnicode, detectFontType, loadMappings, getMappings };
}
