<!-- markdownlint-disable MD004 MD007 MD010 MD041 MD022 MD024 MD032 -->

# pico-dom

## example

```javascript
co('table', {}, [
  co('thead', {}, [
    co('tr', {}, [
      li('th', {})
    ])
  ]),
  co('tbody', {}, [
    li('tr', {}, [
      co('td', {}, [
        co.svg('svg', {})
        co('input', {props: {type: 'checkbox'}})
      ]),
      li('td', {}),
      co('td', {})
    ])
  ]),
])
```

## TODO
transform data
