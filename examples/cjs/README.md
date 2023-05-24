# mediatr-ts cfj example

This example use CJS module.

## Instruction for local dev

- From mediatr-ts folder run `npm pack` to build & pack, a `.tgz` file is created with version on `package.json`
- On cjs `package.json` file change the version
- run `npm run reinstall` and `npm run start`

## tsconfig

Relevant changes

``` json
{
    "target": "ES5",
    "module": "commonjs",
}
```
