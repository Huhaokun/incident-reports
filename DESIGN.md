# Visual design

Editorial reading layout for the public archive. The source of truth for tokens is the `:root` block in `_sass/_editorial.scss`.

This file is excluded from the Jekyll build (`_config.yml`, alongside `README.md`) so it stays in the repository without becoming a page in the site header.

The homepage and each report page keep the existing Chinese UI, taxonomy, and filters. Report bodies in `_reports/` are unchanged. English panel kickers (`Index / Structure`, `Facts / Structure`, `Glossary`, `Cause / Structure`, `Controls / SOP`) are small UI labels set in Inter, in the same role as the reference card’s `IDEA / STRUCTURE`.

## Typography

| Role | Family | Fallback if the CDN does not load |
| --- | --- | --- |
| Display titles | Noto Serif SC 700 | Source Han Serif SC, Songti SC, STSong, SimSun, serif |
| Body and Chinese UI | Noto Sans SC 400 / 700 | PingFang SC, Hiragino Sans GB, Microsoft YaHei, system-ui |
| English micro-labels | Inter 400 / 500 / 600 | the body stack |

Noto Serif SC is the Google web name of Source Han Serif SC (思源宋体). Both names are listed so a locally installed Source Han file is used before the download.

Stylesheets come from jsDelivr `@fontsource`, linked in `_includes/head.html`:

- `@fontsource/noto-serif-sc@5.2.8` weight 700
- `@fontsource/noto-sans-sc@5.2.5` weights 400 and 700
- `@fontsource/inter@5.2.5` weights 400, 500, and 600

Those CJK files are unicode-range slices (`font-display: swap`). The browser downloads the slices a page actually uses. Text stays readable in the system stack while the webfonts arrive, and if jsDelivr is blocked.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#ffffff` | Page background |
| `--ink` | `#191919` | Titles and body |
| `--label` | `#454745` | Secondary labels |
| `--meta` | `#4c5552` | Kickers, footnotes, table meta |
| `--green-panel` | `#f6f7f2` | Glossary, fact summary, ask band |
| `--green-panel-deep` | `#eff4ee` | Reserved deeper green tint |
| `--lavender-panel` | `#f5f0f6` | Cause structure |
| `--accent-green` | `#4d675c` | Quote bar, timeline, active sort |
| `--accent-purple` | `#665a7e` | List bar, unknown dates |
| `--line` | `#e6e6e4` | 1px dividers |

## Layout

Sections are separated with whitespace and 1px rules. Soft panels wrap structured blocks only: the homepage index, the report fact summary, 背景知识, 根因, and 既有防护 / SOP. Lesson cards and the timeline sit on white. The timeline and the archive note use a 3px green bar; 运气 uses the purple bar.

The homepage filter stays a search box plus dropdowns for 公司, 类型, 根因类别, and 导火索类型. Category counts stay inside those menus. The index does not render tag chips.

## Breakpoints

Spreads, the ask band, and three-up cards stack under 860px. The filter grid goes to two columns under 980px and one column under 640px. The comparison table keeps its horizontal scroll on narrow screens.
