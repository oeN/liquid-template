## Liquid Templates

This is a plugin for Obsidian (https://obsidian.md).

With this plugin, you can write your templates using [LiquidJS](https://liquidjs.com/) tags

## Examples

This means that you can create a template made from smaller ones, for example (assuming that your templates folder is `templates`): 

*templates/header.md*
```
# Header

Insert a common header
```

*templates/footer.md*
```
---
I'm just a footer
```

*templates/awesome_template.md*
```
{% include "header" %}

This is the body of my note: {{title}}
link to today note [[{{date}}]]

{% include "footer" %}
```

When you create a note with the "Awesome template" template, you'll end up with:

*A cool title.md*
```
# Header

Insert a common header

This is the body of my note: A cool title
link to today note [[2021-05-21]

---
I'm just a footer
```

But other than that, you can use all the basic [tags](https://liquidjs.com/tags/overview.html) and [filters](https://liquidjs.com/filters/overview.html)

## Template context

Other than the classic, `date`, `time` and `title` variable you also have:

| Name | Description |
| --- | --- |
| default_date_format | The date format that you have specified in the plugin settings and can be used like this: `{{ "now" | date: default_date_format }}` |
| default_time_format | The time format that you have specified in the plugin settings and can be used like this: `{{ "now" | date: default_time_format }}` |

## Roadmap

For now, this plugin just includes the basic version of LiquidJS, but I want to extend it to allow:

- [ ] Parse a selected template string, something like you select `{{ "dQw4w9WgXcQ" | youtube_iframe }}` run a command and end up with the parsed result, in this case, the youtube iframe. (the `youtube_iframe` tag does not exist yet)
- [ ] Implement/install a filter that allows you to write {{ 1 | days_ago | date: default_date_format }}