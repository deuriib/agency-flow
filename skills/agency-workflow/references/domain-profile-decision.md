# Domain profile decision guide

The FRAME phase must declare a Domain profile. This reference helps decide
it correctly. Answer three questions in order.

## Question 1 — Which divisions does the project need?

List every division from `agency-agents` that will *produce* an artifact.

| Project shape              | Typical domains                                  |
|----------------------------|--------------------------------------------------|
| Code feature / refactor    | Engineering, Testing, Product                    |
| Campaign                   | Marketing, Content, Design, Product              |
| Brand identity             | Design, Marketing, Content                       |
| UX research                | Product, Design                                  |
| Sales enablement           | Sales, Marketing, Content                        |
| Game / spatial launch      | Game Dev / Spatial, Design, Marketing, Product   |
| Documentation              | Content, Product                                 |
| Internal process           | Project Management, Product                      |

Rule: **producer domains only**. Do not list a division because it might
review something — that is the VERIFY phase's job.

## Question 2 — What is the deliverable type?

One of: `code | campaign | content | design | research | launch | doc`.

This is a *shape* signal, not a category. It tells later phases how to
group artifacts.

## Question 3 — RESEARCH and MEASURE?

Default: **no / no**. Only set `yes` when the project has an explicit need:

| Need                                     | RESEARCH | MEASURE |
|------------------------------------------|----------|---------|
| Choosing a goal with no prior evidence   | yes      | —       |
| Validating a message or design with users| yes      | —       |
| Post-launch outcome must be tracked      | —        | yes     |
| Both questions apply                     | yes      | yes     |

If unsure, leave `no`. A phase that runs without a real need is worse
than a phase that is skipped.

## Exit criteria

- The domain profile lists producer domains only.
- The deliverable type is one of the canonical values.
- RESEARCH and MEASURE are explicitly `yes` or `no`, not blank.
