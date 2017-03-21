## Resources
* [developer.mozilla.org](https://developer.mozilla.org/) (documentation about html, css and js)
* [susydocs.oddbird.net](//susydocs.oddbird.net/) (susy documentation)
* [sass-lang.com/documentation](//sass-lang.com/documentation/) (sass documentation)
* [getbem.com](//getbem.com/) (BEM)
* [html5doctor.com](//html5doctor.com) (expl. when you should use which html element)
* [css-tricks.com](//css-tricks.com)
* [caniuse.com](//caniuse.com) (database of browser support for specific feature)
* [the-echoplex.net/flexyboxes](http://the-echoplex.net/flexyboxes/) (Flexbox generator)

#### Specific articles
* [Full width bars](https://css-tricks.com/full-browser-width-bars/#article-header-id-2)
* [SVG symbols](https://css-tricks.com/svg-use-with-external-reference-take-2/)
* [susy](https://www.smashingmagazine.com/2015/07/smarter-grids-with-sass-and-susy/)
* [box-sizing](https://css-tricks.com/box-sizing/)
* [using rem](https://snook.ca/archives/html_and_css/font-size-with-rem)

#### Learning resources
* [learn every day css, scss or js within 5 minutes](https://www.enki.com/)

## Remarks
* define colors in the `style.scss` with the naming convention `$color-colorName-modifier` (example: `$color-grey-light`)
* try to avoid `z-index: -1`

##### Last but not least
![](https://media.giphy.com/media/l46Co9ioieLMCeyQM/giphy.gif)
* Don't use `id`'s within stylesheets, use them to link elements within html
* Don't style elements without using a class (on it self or parent) (excluding base styles)
* Don't set a font-size in pixels, use rem (example: `font-size: rem(14px);`)
* Don't set offsets with `margin` or `padding`, try one of beneath
    *  `float`
    *  `vertical-align`
    *  `display: table`
    *  `display: flexbox`
