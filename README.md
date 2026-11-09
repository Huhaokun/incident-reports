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
| `impact`, `root` | Short notes already extracted for the archive. |
| body | Full analysis HTML, inside `{% raw %}`. Keep it as stored. Do not paste the downloaded original page. |

The index searches these fields, filters by company and kind, and sorts by date, company, or title. Date sorts keep unknown dates at the end.

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
