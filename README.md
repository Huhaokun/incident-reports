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
| `background` | Glossary for this report: a list of `term` and `explanation`. Empty means the page shows 本报告无额外前置概念（常见工程背景即可）. |
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
| `trigger_type` | Primary derived trigger type. `无法判断` when the analysis does not support one label. |
| `trigger_types` | Primary first, then any other type the same analysis clearly supports. |
| `trigger_evidence` | Short quote from that analysis justifying the trigger labels. |
| `root_category` | Primary derived root-cause category. |
| `root_categories` | Primary first, then other categories the analysis clearly supports. |
| `root_evidence` | Short quote from that analysis justifying the root labels. |
| `detection` | The 检测 section. |
| `mitigation` | The 止血 section. |

### `background`

Place this after the facts panel. Each item is one prerequisite term that appears in that analysis, plus a one-to-three sentence explanation of how the term is used in this incident. Do not add facts about what happened that the analysis does not state. If the write-up stays within common engineering language, leave `background` empty so the page shows 本报告无额外前置概念（常见工程背景即可）.

```yaml
background:
  - term: gh-ost
    explanation: 分析里用来做这次 MySQL 跨集群表迁移的工具。大批量删除让它的复制延迟升高。
```

### Other structured keys

- `cause.direct`, `cause.factors`, `cause.chain`, `cause.gaps`, `cause.mechanism`: list items from 直接原因, 促成因素, 因果链 or Five Whys, 为何没挡住, and 根因机制.
- `timeline`: one string per time point in the 时间线 section.
- `actions`: each group has `type` (the source heading, such as `Prevent` or `Detect / Process`) and `items`.
- `lessons.well`, `lessons.poorly`, `lessons.lucky`, `lessons.other`: from 做得好 / 做得差 / 运气, or Well / Poorly / Lucky. Other sentences stay in `other`.
- `amplifiers`: 影响为何扩大.
- `controls_table`: 既有防护 rows with `name`, `exists`, `behavior`, and `tone` (`fail`, `ok`, or `neutral`). Use this when the analysis gives a real table, or names controls under 存在的控制. Unknown cells are `报告未说明`. A source row with only two cells gets `报告未说明` in the missing cell.
- `controls`: a clean list when the section is prose or a gap note that does not fill all three cells. Do not leave markdown pipes in either field.

### Derived taxonomy

根因类别 and 导火索类型 are not labels from the original incident write-ups. This site assigns them from the analysis text. The fixed lists are in `_data/taxonomy.yml`. The page says 「归类由本站根据分析归纳，非原报告表述」. A report can have more than one label; the first is primary. Summary counts include a report in every label it carries, so the counts can add up to more than 31.

Root-cause categories:

| Label | Use when the analysis says |
| --- | --- |
| 配置/变更错误 | A wrong or overly broad config, flag, or generated config caused the failure. |
| 软件缺陷 | A code defect, missing check, crash, or bad library behavior is the mechanism. |
| 容量/资源耗尽 | CPU, memory, connections, or bandwidth were exhausted. |
| 依赖故障 | An upstream service failed and that dependency is the cause. Unused so far. |
| 网络/BGP/DNS | Routing, DNS, backbone, or a public-network path is the cause. |
| 数据库/存储 | Replication, disk, or stored data integrity is the cause. |
| 硬件/内核/平台 | Facility hardware, power, kernel, or platform behavior is the cause. |
| 安全/攻击 | An attack itself is the cause, not merely the occasion. Unused so far. |
| 流程/人为操作 | An operator action or an allowed unsafe procedure is the cause. |
| 无法判断 | The analysis explicitly refuses a single cause. |

Trigger types:

| Label | Use when the analysis says |
| --- | --- |
| 配置推送 | A config, rule, flag, or permission change was published. |
| 代码发布/升级 | A deploy, version upgrade, or new service rollout started it. |
| 迁移/维护操作 | A migration, maintenance window, or planned move started it. |
| 流量突增/攻击 | A flood, attack, or surge is what set it off. |
| 自动化/定时任务 | A cron job, autoscaler, or other automation started it. |
| 硬件或外部依赖故障 | Power, cooling, a cable cut, or an outside facility fault started it. |
| 潜伏缺陷被条件触发 | A dormant bug became active when a threshold or rare input appeared. |
| 人工操作/命令 | A person ran a command or filled a parameter by hand. |
| 无法判断 | The analysis says there is no single moment, or it does not say which event came first. |

When adding a report, copy a short evidence phrase from its analysis into `root_evidence` and `trigger_evidence`. Do not invent a label the text does not support.

The index is a plain comparison table. Filters are dropdowns for company, record type, root-cause category, and trigger type. Category counts sit inside those menus, not as chips on the page. A category filter matches any report that lists that label, not only the primary. Column headers sort. Date sorts keep unknown dates at the end. The table shows the primary label only; extra labels and evidence stay on the report page.

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
