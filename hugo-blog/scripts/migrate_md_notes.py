#!/usr/bin/env python3
"""Migrate Markdown notes from ../md-notes into Hugo src/posts."""

from __future__ import annotations

import datetime as dt
import hashlib
import re
import shutil
import sys
import unicodedata
from pathlib import Path


SITE_ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = SITE_ROOT.parent / "md-notes"
DEST_ROOT = SITE_ROOT / "src" / "posts"


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^A-Za-z0-9]+", "-", ascii_value).strip("-").lower()
    if slug:
        return slug
    digest = hashlib.sha1(value.encode("utf-8")).hexdigest()[:8]
    return f"post-{digest}"


def toml_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")


def toml_array(values: list[str]) -> str:
    return "[" + ", ".join(f'"{toml_string(value)}"' for value in values) + "]"


def find_title(markdown: str, fallback: str) -> str:
    in_fence = False
    for line in markdown.splitlines():
        stripped = line.strip()
        if stripped.startswith("```") or stripped.startswith("~~~"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        match = re.match(r"^#\s+(.+?)\s*$", line)
        if match:
            return match.group(1).strip()
    return fallback


def read_markdown(path: Path) -> str:
    data = path.read_bytes()
    for encoding in ("utf-8-sig", "utf-8", "gb18030"):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace")


def front_matter(source: Path, relative: Path, title: str, categories: list[str]) -> str:
    timestamp = dt.datetime.fromtimestamp(source.stat().st_mtime, dt.timezone.utc)
    slug = slugify(source.stem)
    tags = categories[:]
    return "\n".join(
        [
            "+++",
            f'title = "{toml_string(title)}"',
            f"date = {timestamp.isoformat()}",
            "draft = false",
            f'slug = "{slug}"',
            f'source_path = "{toml_string(relative.as_posix())}"',
            f"categories = {toml_array(categories)}",
            f"tags = {toml_array(tags)}",
            "+++",
            "",
            "",
        ]
    )


def migrate() -> int:
    if not SOURCE_ROOT.is_dir():
        print(f"Source directory not found: {SOURCE_ROOT}", file=sys.stderr)
        return 1

    if DEST_ROOT.exists():
        shutil.rmtree(DEST_ROOT)
    DEST_ROOT.mkdir(parents=True, exist_ok=True)

    count = 0
    for source in sorted(SOURCE_ROOT.rglob("*.md")):
        relative = source.relative_to(SOURCE_ROOT)
        markdown = read_markdown(source)
        title = find_title(markdown, source.stem.replace("_", " ").replace("-", " "))
        categories = list(relative.parts[:-1])
        slug_parts = [slugify(part) for part in relative.with_suffix("").parts]
        dest_dir = DEST_ROOT.joinpath(*slug_parts)
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / "index.md"
        dest.write_text(
            front_matter(source, relative, title, categories) + markdown.rstrip() + "\n",
            encoding="utf-8",
        )
        count += 1

    print(f"Migrated {count} Markdown files into {DEST_ROOT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(migrate())
