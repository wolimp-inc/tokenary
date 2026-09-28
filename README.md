# @wolimp/tokenary

Compila mapas de tokens em funções de substituição reutilizáveis. O pacote não
possui dependências e pode ser usado diretamente em projetos Node.js.

## Instalação

```bash
npm install @wolimp/tokenary
```

## Uso

```js
const { compile, replace, replaceOneShot } = require('@wolimp/tokenary');

const message = replaceOneShot({
  source: 'Olá, {{name}}!',
  pairsMap: { name: 'Ada' },
  keyMask: '{{?}}'
});

const compiledReplacer = compile({
  pairsMap: { name: 'Ada', language: 'JavaScript' },
  keyMask: '{{?}}'
});

const first = replace({
  source: '{{name}} usa {{language}}.',
  compiledReplacer
});

const second = compiledReplacer('{{language}} também pode ser rápido.');
```

Também é possível usar imports ES modules:

```js
import { compile, replace, replaceOneShot } from '@wolimp/tokenary';
```

O caractere `?` em `keyMask` representa a chave do `pairsMap`. Em
`replaceMask`, ele representa o valor convertido para string:

```js
replaceOneShot({
  source: ':status',
  pairsMap: { status: 'ready' },
  keyMask: ':?',
  replaceMask: '[?]'
}); // "[ready]"
```

## Build

```bash
npm run build
```

O build gera quatro bundles UMD, utilizáveis por CommonJS ou diretamente no
navegador pelo global `Tokenary`:

| Arquivo | Destino |
| --- | --- |
| `dist/tokenary.js` | Versão moderna de desenvolvimento |
| `dist/tokenary.min.js` | Versão moderna minificada |
| `dist/tokenary.esm.js` | Versão moderna ES module |
| `dist/tokenary.legacy.js` | Versão ES5 de desenvolvimento |
| `dist/tokenary.legacy.min.js` | Versão ES5 minificada |

A versão legacy usa somente sintaxe ES5. A API pública é síncrona e não
depende de `Promise`.
