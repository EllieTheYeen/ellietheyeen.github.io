---
layout: post
title: Making tables in Liquid from Jekyll front matter YAML
date: 2023-12-04 00:00
tags:
- liquid
- jekyll
- yaml
- html
table:
 -
  - a
  - b
  - c
 -
  - 1
  - 2
  - 3
 -
  - x
  - y
  - z
---
Did you know that you can generate tables from data in Liquid so you do not have to deal with the format that markdown uses for tables? Here is how you can do that.

Let's look at the HTML table below. 

<table>
{%- for row in page.table -%}
 {%- tablerow cell in row -%}
  {{ cell }}
 {%- endtablerow -%}
{%- endfor -%}
</table>

It is rendered from the following HTML.

```html
<table><tr class="row1">
<td class="col1">a</td><td class="col2">b</td><td class="col3">c</td></tr>
<tr class="row1">
<td class="col1">1</td><td class="col2">2</td><td class="col3">3</td></tr>
<tr class="row1">
<td class="col1">x</td><td class="col2">y</td><td class="col3">z</td></tr>
</table>
```

And the Liquid to generate the HTML is here.

```liquid
{%- raw -%}
<table>
{%- for row in page.table -%}
 {%- tablerow cell in row -%}
  {{ cell }}
 {%- endtablerow -%}
{%- endfor -%}
</table>
{% endraw -%}
```

What it actually accesses is the following yaml that is placed in the front matter of the Jekyll post which can be accessed from the page.

```yaml
table:
 -
  - a
  - b
  - c
 -
  - 1
  - 2
  - 3
 -
  - x
  - y
  - z
```

An upside of this too versus using JavaScript is that search engines can see your tables easier and allows also for programmatic access by other bots too such as the ones in certain text editors.

The only downside so far is I have not found out a way to make table headers for these kinds of tables in some reasonably easy way.

You might also want to look at the source for [this page]({{ page.path | prepend: 'https://github.com/EllieTheYeen/ellietheyeen.github.io/blob/main/'}})
