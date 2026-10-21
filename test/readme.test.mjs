import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import vm from 'node:vm'

const readme = await fs.readFile(new URL('../README.md', import.meta.url), 'utf8')
const catalog = JSON.parse(await fs.readFile(new URL('../prefixes.json', import.meta.url), 'utf8'))
const validators = JSON.parse(await fs.readFile(new URL('../validators.json', import.meta.url), 'utf8'))
const example = (language, fence) => {
  const match = readme.match(new RegExp('<summary><b>' + language + '</b></summary>[\\s\\S]*?```' + fence + '\\n([\\s\\S]*?)```'))
  assert.ok(match, `No se encontró el ejemplo ${language}`)
  return match[1]
}
// Ejecuta el JavaScript del README con los JSON locales, sin acceder a la CDN.
const context = vm.createContext({ fetch: async (url) => ({
  json: async () => url.endsWith('/prefixes.json') ? catalog : validators,
}) })
const { isCubanCard, describe } = await vm.runInContext(
  `(async () => { ${example('JavaScript', 'js')}\nreturn { isCubanCard, describe } })()`, context)

// Tarjetas sintéticas: prefijo conocido, cuenta de ceros y control calculado.
const synthetic = (prefix) => {
  const body = prefix.padEnd(15, '0')
  const sum = [...body].reverse().reduce((sum, digit, index) => {
    const value = Number(digit) * (index % 2 === 0 ? 2 : 1)
    return sum + (value > 9 ? value - 9 : value)
  }, 0)
  return body + (10 - sum % 10) % 10
}
// Las claves de patrón salen del catálogo, igual que en scripts/build.mjs, para que un producto nuevo no rompa la prueba.
const productKey = (product) => product.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '_')
const bank = catalog.issuers.find(i => i.network === 'RED' && i.code?.length === 4).code
const red = (currency, mlc) => synthetic(catalog.prefixes.find(p => p.network === 'RED' && p.currency === currency && (mlc === undefined || p.mlc_backed === mlc)).prefix + bank)
const cup = red('CUP'), usd = red('USD', true)
const fixtures = { any: cup, red: cup, cup, usd, usd_mlc: usd }
for (const p of catalog.prefixes.filter(p => p.network !== 'RED')) {
  fixtures[productKey(p.product)] = synthetic(p.prefix)
  for (const variant of p.variants ?? []) fixtures[productKey(variant.product)] = synthetic(variant.prefix)
}
const cases = [
  ...Object.entries(fixtures).map(([kind, raw]) => [raw, kind, true]),
  [cup.match(/.{4}/g).join('\u00a0'), 'cup', true], [cup.match(/.{4}/g).join('\u202f'), 'any', true],
  ['', 'any', false], ['0', 'any', false], ['0'.repeat(16), 'any', false],
  [usd, 'cup', false], [cup, 'usd', false],
  [cup.slice(0, -1) + (Number(cup.at(-1)) + 1) % 10, 'any', false],
]
const invalidKinds = ['CUP', 'desconocido', '', 'BANDEC', 'constructor', 'toString', '__proto__']
const errorMessage = (kind) => `kind inválido: ${String(kind)}. Usa: ${Object.keys(validators.patterns).join(', ')}`

test('JavaScript: conserva los tipos, la moneda, Luhn y la normalización', () => {
  assert.deepEqual(Object.keys(fixtures).sort(), Object.keys(validators.patterns).sort())
  for (const [raw, kind, expected] of cases) assert.equal(isCubanCard(raw, kind), expected)
  assert.equal(isCubanCard(cup), true)
  assert.equal(isCubanCard(null), false)
  assert.equal(describe(cup.match(/.{4}/g).join(' - . ')).bank, 'BANDEC')
})

test('JavaScript: los tipos desconocidos fallan con los valores admitidos', () => {
  for (const kind of [...invalidKinds, null, 0, {}, ['cup']]) {
    for (const raw of ['', '0', usd]) {
      assert.throws(() => isCubanCard(raw, kind), { name: 'RangeError', message: errorMessage(kind) })
    }
  }
})

// PHP es opcional localmente, pero obligatorio en CI.
const php = spawnSync('php', ['--version'])
test('PHP: conserva los casos válidos y rechaza los tipos desconocidos', { skip: php.error?.code === 'ENOENT' && !process.env.CI }, () => {
  assert.equal(php.status, 0, 'Se necesita PHP en CI para probar el ejemplo del README')
  const sample = example('PHP', 'php')
  const functions = sample.slice(sample.indexOf('function luhn'), sample.indexOf('var_dump('))
  const checks = [...cases, ...invalidKinds.flatMap(kind => ['', '0', usd].map(raw => [raw, kind, `InvalidArgumentException: ${errorMessage(kind)}`]))]
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64')
  const result = spawnSync('php', [], { encoding: 'utf8', input: `<?php
${functions}
$v = json_decode(base64_decode('${encode(validators)}'), true);
$checks = json_decode(base64_decode('${encode(checks)}'), true);
$results = [];
foreach ($checks as [$raw, $kind]) {
    try { $results[] = isCubanCard($raw, $v, $kind); }
    catch (InvalidArgumentException $e) { $results[] = get_class($e) . ': ' . $e->getMessage(); }
}
// Con el modificador u, preg_replace devuelve null ante UTF-8 inválido.
$results[] = isCubanCard("9205\\xff", $v);
echo json_encode($results);
` })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.equal(result.stderr, '')
  assert.deepEqual(JSON.parse(result.stdout), [...checks.map(([, , expected]) => expected), false])
})
