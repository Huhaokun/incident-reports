# incident-reports

Public archive of incident write-ups and technical case notes, published with Jekyll and the [Minima](https://github.com/jekyll/minima) theme.

The site is a GitHub Pages project site: [https://huhaokun.github.io/incident-reports/](https://huhaokun.github.io/incident-reports/).

## Records

Each report is one file in `_reports/`. The file name is the stable id. Jekyll publishes it at `/incident-reports/reports/<id>/`.

Front matter:

| Field | Meaning |
| --- | --- |
| `title` | Official title, in the source's original language. Do not translate or rewrite it. |
| `company` | Organization named in the archive. |
| `kind` | `事故复盘` or `技术个案`. |
| `incident_date` | Display date copied from the archive. Unknown dates stay as written, for example `日期未确认`. |
| `date_sort` | Existing sort key (`YYYY-MM-DD`). Unknown dates stay `0000-00-00`. |
| `date_unknown` | `true` when the archive did not confirm a calendar date. |
| `source_url` | Link to the original source only. Do not point this at a Google Doc or any other transcript. |
| `completeness` | Archive note about how complete the original was. |
| `impact`, `root` | Short notes already extracted for the archive. Kept for search. |
| `facts` | Scan fields copied from the analysis. See below. |
| `cause`, `timeline`, `actions`, `lessons`, `amplifiers`, `controls` | Lists taken from the matching v2 sections. |
| body | Full analysis HTML, inside `{% raw %}`. Keep it as stored. Do not paste the downloaded original page. The report page still shows this under 完整分析. |

### `facts`

Fill these when adding a report. If the source does not say it, use `报告未说明`. Do not invent a label.

| Key | What to copy |
| --- | --- |
| `duration` | The analysis line `严重度/时长`, or one explicit duration phrase such as `中断27分钟`. |
| `scope` | The 影响 section. |
| `symptoms` | User-visible sentences only when the 影响 section separates them. Otherwise `报告未说明`. |
| `trigger` | The 导火索 section. |
| `trigger_type` | Only a type the source itself names. All current reports are `报告未说明`. |
| `root_category` | Only a category the source itself names. All current reports are `报告未说明`. |
| `detection` | The 检测 section. |
| `mitigation` | The 止血 section. |

### Other structured keys

- `cause.direct`, `cause.factors`, `cause.chain`, `cause.gaps`, `cause.mechanism`: list items from 直接原因, 促成因素, 因果链 or Five Whys, 为何没挡住, and 根因机制.
- `timeline`: one string per time point in the 时间线 section.
- `actions`: each group has `type` (the source heading, such as `Prevent` or `Detect / Process`) and `items`.
- `lessons.well`, `lessons.poorly`, `lessons.lucky`, `lessons.other`: from 做得好 / 做得差 / 运气, or Well / Poorly / Lucky. Other sentences stay in `other`.
- `amplifiers`, `controls`: 影响为何扩大 and 既有防护.

The index is a comparison table. It filters by company, record type, root-cause category, and trigger type, and the column buttons sort. Date sorts keep unknown dates at the end.

## Theme pin

GitHub Pages builds this with the [supported gemset](https://pages.github.com/versions.json) recorded for this site:

- `github-pages` 232
- Jekyll 3.10.0
- Minima 2.5.1, pinned in `_config.yml` as `remote_theme: jekyll/minima@v2.5.1`

`baseurl` is `/incident-reports`. Page, stylesheet, and script links go through `relative_url`, so they keep that project path.

There is no `.nojekyll` file. Pages must run Jekyll for Minima to render. Do not add `.nojekyll` back unless you mean to serve the files unbuilt.

## Local build

Ruby 3.2 or 3.3 is enough. From the repository root:

```bash
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll build
bundle exec jekyll serve
```

Open `http://127.0.0.1:4000/incident-reports/`. `serve` uses the `baseurl` in `_config.yml`.

`bundle install` downloads the pinned Minima release the first time Jekyll builds.

## Publish

GitHub Pages for this repository is already set to deploy from the `main` branch, folder `/` (root). Merging to `main` publishes the Jekyll site. No extra Pages source change is required for this theme as long as that setting stays on branch `main` / root.

After a merge, the Pages build has to finish before [https://huhaokun.github.io/incident-reports/](https://huhaokun.github.io/incident-reports/) shows the new templates. Until that build is green, the public URL can still be the previous site.
