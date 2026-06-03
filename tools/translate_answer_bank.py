"""
Batch-translate untranslated .i18n-en spans in answer-bank.html.
Finds spans with Chinese text in the English slot, translates via DeepSeek API.
"""
import re, os, sys, json, time
from html.parser import HTMLParser

API_KEY = os.environ.get("DEEPSEEK_API_KEY")
if not API_KEY:
    print("ERROR: DEEPSEEK_API_KEY not set")
    sys.exit(1)

API_BASE = "https://api.deepseek.com/v1"
MODEL = "deepseek-chat"
BATCH_SIZE = 50

INPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "reference", "answer-bank.html")
CHECKPOINT_FILE = os.path.join(os.path.dirname(__file__), "ab_checkpoint.json")

from openai import OpenAI
client = OpenAI(api_key=API_KEY, base_url=API_BASE)

CHINESE_RE = re.compile(r'[一-鿿]')

def has_chinese(text):
    return bool(CHINESE_RE.search(text))

class I18nEnFinder(HTMLParser):
    """Find .i18n-en spans and record their position + text."""
    def __init__(self):
        super().__init__()
        self.spans = []
        self._in_target = False
        self._start_pos = 0
        self._end_pos = 0
        self._text = ""

    def handle_starttag(self, tag, attrs):
        if tag == 'span':
            attrs_dict = dict(attrs)
            classes = attrs_dict.get('class', '').split()
            if 'i18n-en' in classes:
                self._in_target = True
                # Record the start of the tag content (after '>')
                self._start_pos = self.getpos()

    def handle_endtag(self, tag):
        if self._in_target and tag == 'span':
            self._in_target = False

    def handle_data(self, data):
        if self._in_target:
            # We need the raw position in the file
            pass  # HTMLParser doesn't give us byte offsets

def translate_batch(texts):
    """Send batch of Chinese strings to DeepSeek for translation."""
    user_content = json.dumps(texts, ensure_ascii=False, indent=2)
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a technical translator. Translate each Chinese string in the JSON array to English.\n"
                    "Context: These are interview answer-bank entries about LangGraph, LLMs, and AI engineering.\n"
                    "Rules:\n"
                    "1. Preserve ALL HTML tags, code markers, numbers, technical terms (API names, function names).\n"
                    "2. Preserve leading punctuation (colons, periods, etc).\n"
                    "3. Translate naturally — be idiomatic English, not literal.\n"
                    "4. Return ONLY a JSON array of translated strings, nothing else. No markdown, no explanation.\n"
                    "5. The output array must have the same length as the input array."
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
    if content.startswith("```"):
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        print(f"  JSON parse error, raw (first 200): {content[:200]}")
        return texts  # fallback to original

def main():
    print(f"Reading {INPUT_FILE}...")
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    # Find all .i18n-en spans using regex
    # Pattern: <span ... class="...i18n-en..." ...>TEXT</span>
    span_pat = re.compile(
        r'<span\s+[^>]*?\bclass="([^"]*?\bi18n-en\b[^"]*)"[^>]*?>(.*?)</span>',
        re.DOTALL
    )

    spans = []
    for m in span_pat.finditer(html):
        text = m.group(2)
        if has_chinese(text):
            spans.append({
                'full_match': m.group(0),
                'text': text,
                'start': m.start(),
                'end': m.end(),
            })

    print(f"Found {len(spans)} .i18n-en spans with Chinese text")

    if not spans:
        print("All .i18n-en spans are already in English!")
        return

    # Load checkpoint
    completed_indices = set()
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r", encoding="utf-8") as f:
            completed_indices = set(json.load(f))
        print(f"Checkpoint: {len(completed_indices)} already translated")

    remaining = [(i, s) for i, s in enumerate(spans) if i not in completed_indices]
    print(f"Remaining: {len(remaining)}")

    batches = [remaining[i:i+BATCH_SIZE] for i in range(0, len(remaining), BATCH_SIZE)]
    print(f"Batches: {len(batches)} (size={BATCH_SIZE})")

    replacements = []  # list of (start, end, old_html, new_html)

    for bi, batch in enumerate(batches):
        texts = [s['text'] for _, s in batch]
        print(f"\nBatch {bi+1}/{len(batches)}: {len(texts)} entries...")

        try:
            translations = translate_batch(texts)
        except Exception as ex:
            print(f"  ERROR: {ex}")
            with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
                json.dump(list(completed_indices), f, ensure_ascii=False)
            print("  Checkpoint saved.")
            sys.exit(1)

        for (idx, span), translation in zip(batch, translations):
            if translation and translation != span['text']:
                old_html = span['full_match']
                # Replace only the text content, preserving the span tag
                new_html = old_html.replace(span['text'], translation)
                replacements.append((span['start'], span['end'], old_html, new_html))
                completed_indices.add(idx)
            else:
                completed_indices.add(idx)  # mark as processed even if no change

        print(f"  Translated: {sum(1 for t, (_, s) in zip(translations, batch) if t != s['text'])}")

        with open(CHECKPOINT_FILE, "w", encoding="utf-8") as f:
            json.dump(list(completed_indices), f, ensure_ascii=False)
        time.sleep(1)

    # Apply replacements (in reverse order to preserve positions)
    print(f"\nApplying {len(replacements)} replacements...")
    replacements.sort(key=lambda r: r[0], reverse=True)
    result = html
    for start, end, old_html, new_html in replacements:
        result = result[:start] + new_html + result[end:]

    print(f"Writing to {INPUT_FILE}...")
    with open(INPUT_FILE, "w", encoding="utf-8") as f:
        f.write(result)

    if os.path.exists(CHECKPOINT_FILE):
        os.remove(CHECKPOINT_FILE)

    # Verify
    remaining_cn = len(CHINESE_RE.findall(result))
    span_pat2 = re.compile(r'<span\s+[^>]*?\bclass="([^"]*\bi18n-en\b[^"]*)"[^>]*>(.*?)</span>', re.DOTALL)
    cn_spans = sum(1 for m in span_pat2.finditer(result) if has_chinese(m.group(2)))
    print(f"Remaining Chinese chars in file: {len(CHINESE_RE.findall(result))}")
    print(f"Remaining .i18n-en spans with Chinese: {cn_spans}")
    print("Done!")

if __name__ == "__main__":
    main()
