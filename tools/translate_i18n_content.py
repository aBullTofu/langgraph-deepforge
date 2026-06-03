"""
Batch-translate untranslated __I18N_CONTENT entries via DeepSeek API.
Parses js/i18n-data.js, finds entries where key == value (untranslated),
translates in batches, writes back.
"""
import re, os, sys, json, time

# ------------------------------------------------------------
# Config
# ------------------------------------------------------------
API_KEY = os.environ.get("DEEPSEEK_API_KEY")
if not API_KEY:
    print("ERROR: DEEPSEEK_API_KEY not set")
    sys.exit(1)

API_BASE = "https://api.deepseek.com/v1"
MODEL = "deepseek-chat"
BATCH_SIZE = 80
INPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "js", "i18n-data.js")
CHECKPOINT_FILE = os.path.join(os.path.dirname(__file__), "translate_checkpoint.json")

from openai import OpenAI
client = OpenAI(api_key=API_KEY, base_url=API_BASE)

# ------------------------------------------------------------
# Parse
# ------------------------------------------------------------
def parse_content_block(text):
    """Return list of (line_str, key, value, is_untranslated, line_idx)."""
    # Find the CONTENT block
    start = text.find("window.__I18N_CONTENT = {")
    end = text.find("\n};", start)
    if start == -1 or end == -1:
        print("ERROR: Could not find __I18N_CONTENT block")
        sys.exit(1)

    block = text[start:end]
    lines = block.splitlines()

    entries = []
    # Regex to match 'key': 'value',
    pat = re.compile(r"^(\s*)'((?:[^'\\]|\\.)*)':\s*'((?:[^'\\]|\\.)*)',?\s*$")

    for i, line in enumerate(lines):
        m = pat.match(line)
        if not m:
            continue
        indent, key, value = m.group(1), m.group(2), m.group(3)
        is_untranslated = (key == value)
        entries.append({
            'line': line,
            'indent': indent,
            'key': key,
            'value': value,
            'untranslated': is_untranslated,
            'line_idx': i,
        })

    return entries, start, block

# ------------------------------------------------------------
# Translate batch
# ------------------------------------------------------------
def translate_batch(keys):
    """Send batch of Chinese strings to DeepSeek for translation. Returns list of English strings."""
    # Build the messages
    user_content = json.dumps(keys, ensure_ascii=False, indent=2)

    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a technical translator. Translate each Chinese string in the JSON array to English.\n"
                    "Rules:\n"
                    "1. Preserve ALL code syntax: function names, variable names, Python keywords, operators, "
                    "backticks, quotes, JSON structure, HTML tags, emoji, `code` markers.\n"
                    "2. For docstring-like text (inside triple quotes), keep the triple-quote markers and translate the content.\n"
                    "3. For strings that are code examples or test data (like '北京', '上海', '你好'), "
                    "translate them naturally (e.g. 'Beijing', 'Shanghai', 'Hello').\n"
                    "4. Keep newline characters (\\n) exactly as they are.\n"
                    "5. Return ONLY a JSON array of translated strings, nothing else. No markdown, no explanation.\n"
                    "6. The output array must have the same length as the input array."
                ),
            },
            {
                "role": "user",
                "content": f"Translate these Chinese strings to English:\n{user_content}",
            },
        ],
        temperature=0.1,
        max_tokens=8192,
    )

    content = resp.choices[0].message.content.strip()
    # Try to parse JSON
    if content.startswith("```"):
        # Strip markdown code fences
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)

    try:
        translations = json.loads(content)
    except json.JSONDecodeError:
        print(f"  JSON parse error on response. Raw (first 300 chars): {content[:300]}")
        # Try to recover by extracting array elements
        translations = []
        for line in content.splitlines():
            line = line.strip().strip(',').strip('"').strip("'")
            if line.startswith('[') or line.startswith(']'):
                continue
            if line:
                translations.append(line)

    # Ensure same length
    while len(translations) < len(keys):
        translations.append(keys[len(translations)])  # fallback to original

    return translations[:len(keys)]

# ------------------------------------------------------------
# Main
# ------------------------------------------------------------
def main():
    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        text = f.read()

    entries, block_start, block_text = parse_content_block(text)
    untranslated = [e for e in entries if e['untranslated']]
    translated_count = len(entries) - len(untranslated)

    print(f"Total entries: {len(entries)}")
    print(f"Already translated: {translated_count}")
    print(f"Untranslated: {len(untranslated)}")

    if not untranslated:
        print("All entries are already translated!")
        return

    # Load checkpoint
    completed_keys = set()
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
            completed_keys = set(json.load(f))
        print(f"Checkpoint: {len(completed_keys)} already translated, resuming...")

    # Filter out already-completed
    remaining = [e for e in untranslated if e['key'] not in completed_keys]
    print(f"Remaining to translate: {len(remaining)}")

    batches = [remaining[i:i+BATCH_SIZE] for i in range(0, len(remaining), BATCH_SIZE)]
    print(f"Batches: {len(batches)} (size={BATCH_SIZE})")

    # Build a map: original_line -> new_value
    replacements = {}  # line_idx -> new_value

    for bi, batch in enumerate(batches):
        keys = [e['key'] for e in batch]
        print(f"\nBatch {bi+1}/{len(batches)}: {len(keys)} entries...")

        try:
            translations = translate_batch(keys)
        except Exception as ex:
            print(f"  ERROR: {ex}")
            print("  Saving checkpoint and exiting...")
            save_checkpoint()
            sys.exit(1)

        for entry, translation in zip(batch, translations):
            if translation and translation != entry['key']:
                replacements[entry['line_idx']] = translation
                completed_keys.add(entry['key'])

        print(f"  Got {len(translations)} translations, {sum(1 for t, e in zip(translations, batch) if t != e['key'])} non-identical")

        # Save checkpoint after each batch
        with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
            json.dump(list(completed_keys), f, ensure_ascii=False)

        # Small delay between batches
        time.sleep(1)

    # Apply replacements
    print(f"\nApplying {len(replacements)} replacements...")
    block_lines = block_text.splitlines()
    entry_by_line = {e['line_idx']: e for e in entries}
    for line_idx, new_value in replacements.items():
        entry = entry_by_line[line_idx]
        old_line = entry['line']
        # Rebuild the line with the same formatting
        new_line = f"{entry['indent']}'{entry['key']}': '{new_value}',"
        block_lines[line_idx] = new_line

    # Reconstruct the file
    new_block = "\n".join(block_lines)
    new_text = text[:block_start] + new_block + text[block_start + len(block_text):]

    # Write
    print(f"Writing to {INPUT_FILE}...")
    with open(INPUT_FILE, "w", encoding="utf-8") as f:
        f.write(new_text)

    # Clean up checkpoint
    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)

    print("Done!")

if __name__ == "__main__":
    main()
