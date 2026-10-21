<div align="center">

<img src="assets/anatomy.svg" alt="Anatomía de una tarjeta cubana: red, producto y moneda, banco, cuenta y dígito de control" width="100%">

# Prefijos de tarjetas cubanas

**Qué producto, qué moneda y qué banco hay detrás de cada tarjeta cubana.**<br>
Un catálogo abierto, con sus fuentes, y validadores listos para usar en cualquier lenguaje.

<!-- badges:start -->
![prefijos](https://img.shields.io/badge/prefijos-29-0ea5e9) ![emisores](https://img.shields.io/badge/emisores-6-6366f1) ![versión](https://img.shields.io/badge/versi%C3%B3n-0.5.1-22c55e) ![dependencias](https://img.shields.io/badge/dependencias-0-f59e0b) [![licencia](https://img.shields.io/badge/licencia-MIT-64748b)](LICENSE) [![check](https://github.com/qvapay/cuban_cards_prefixes/actions/workflows/check.yml/badge.svg)](https://github.com/qvapay/cuban_cards_prefixes/actions/workflows/check.yml)
<!-- badges:end -->

[Inicio rápido](#-inicio-rápido) · [Anatomía](#-anatomía-de-una-tarjeta) · [Prefijos](#-prefijos) · [Validar](#-validar-un-número) · [Formato](#-formato-de-los-datos) · [Versiones](#-versiones-y-compatibilidad) · [Contribuir](#-contribuir) · [English](#-english)

</div>

---

## ✨ Para qué sirve

- **Validar formularios.** Rechaza al momento un número que no es una tarjeta cubana o que tiene un dígito mal tecleado.
- **Decir qué tarjeta es mientras se escribe.** Con los 8 primeros dígitos ya puedes mostrar «Tarjeta en CUP · BANDEC · Ahorro».
- **Evitar envíos a la tarjeta equivocada.** Distingue CUP, USD con respaldo en MLC y la Clásica antes de mandar el dinero.
- **Sin dependencias, en cualquier lenguaje.** Son dos ficheros JSON y unas expresiones regulares.
- **Con fuentes.** Cada prefijo dice de dónde sale, y lo que no está confirmado se marca como tal.

> [!NOTE]
> No es una fuente oficial de ningún banco. Es un catálogo comunitario: verifica los datos antes de usarlos para mover dinero.

## ⚡ Inicio rápido

Los datos se pueden usar directamente desde la CDN de jsDelivr, que admite CORS y sirve también en el navegador, o desde GitHub:

```text
https://cdn.jsdelivr.net/gh/qvapay/cuban_cards_prefixes@main/validators.json
https://cdn.jsdelivr.net/gh/qvapay/cuban_cards_prefixes@main/prefixes.json
https://raw.githubusercontent.com/qvapay/cuban_cards_prefixes/main/prefixes.json
```

```js
const v = await fetch('https://cdn.jsdelivr.net/gh/qvapay/cuban_cards_prefixes@main/validators.json').then(r => r.json())

const n = '9205 0699 0000 0000'.replace(new RegExp(v.normalize.strip_pattern, 'g'), '')

new RegExp(v.patterns.cup).test(n)     // true: es una tarjeta en CUP
new RegExp(v.issuers.BANDEC).test(n)   // true: es de BANDEC
// Falta el dígito de control: ver «Validar un número»
```

`@main` siempre trae la última versión. Para que tu integración no cambie sin que lo decidas tú, fija una versión: `@v0.5.0` en lugar de `@main`. Ver [Versiones y compatibilidad](#-versiones-y-compatibilidad).

Cada push a `main` purga la caché de jsDelivr, así que `@main` refleja el cambio en pocos minutos en lugar de las 12 horas que tarda por defecto.

| Fichero | Qué contiene |
|---|---|
| [`prefixes.json`](prefixes.json) | El catálogo: estructura del número, bancos, prefijos con su producto y su moneda, y fuentes. Es el único fichero que se edita a mano. |
| [`validators.json`](validators.json) | Expresiones regulares generadas a partir del catálogo: por moneda, por banco y para la Clásica y sus variantes. |
| [`schema.json`](schema.json) | El esquema de `prefixes.json` (JSON Schema 2020-12). |
| [`CHANGELOG.md`](CHANGELOG.md) | Qué cambió en cada versión y si afecta a lo que aceptan los patrones. |

## 🔢 Anatomía de una tarjeta

Las tarjetas de la red **RED** tienen 16 dígitos:

| Dígitos | Qué indican | Ejemplo |
|:-:|---|---|
| 1–2 | Red RED | `92` |
| 3–4 | Producto y moneda | `05`: ahorro en CUP |
| 5–8 | Banco | `0699`: BANDEC |
| 9–15 | Cuenta | |
| 16 | Dígito de control [Luhn](https://es.wikipedia.org/wiki/Algoritmo_de_Luhn) (ISO/IEC 7812) | |

Con los **4 primeros dígitos** ya se sabe el producto y la moneda. Con los **8 primeros**, también el banco.

La tarjeta **Clásica** (`9760`) y las **AIS** (`9550` y `9560`) no siguen esta estructura: sus dígitos 5–8 no son un código de banco. Los dígitos 5–6 de la Clásica distinguen productos: `976004` es la Clásica Empresarial.

## 🏦 Bancos

<!-- banks:start -->
| Banco | Dígitos 5–8 | Patrón |
|---|:-:|---|
| **BANDEC** · Banco de Crédito y Comercio | `0699` | `issuers.BANDEC` |
| **BPA** · Banco Popular de Ahorro | `1299` | `issuers.BPA` |
| **Banco Metropolitano** | `9598` | `issuers.METROPOLITANO` |
| **BICSA** · Banco Internacional de Comercio S.A. | `04··` (parcial) | `issuers.BICSA` |
| **FINCIMEX** · Financiera CIMEX S.A. | — | `patterns.clasica` |
| **AIS** · American International Services | — | `patterns.ais_cup`, `patterns.ais_usd` |
<!-- banks:end -->

## 📋 Prefijos

<!-- prefixes:start -->
### 🇨🇺 Pesos cubanos (CUP)

| Prefijo | Producto | Confirmado en | Fuentes |
|:-:|---|---|:-:|
| **`9200`** | _Sin identificar_ · [¿la tienes?](https://github.com/qvapay/cuban_cards_prefixes/issues/new?template=prefijo.yml&prefix=9200) ¹ | BANDEC, Metropolitano | C · H · T |
| **`9202`** | _Sin identificar_ · [¿la tienes?](https://github.com/qvapay/cuban_cards_prefixes/issues/new?template=prefijo.yml&prefix=9202) | — | C |
| **`9204`** | Nómina, fondos, ahorro ² | BANDEC, BPA | B · H · C · T |
| **`9205`** | Ahorro ³ | BANDEC, Metropolitano, BPA | B · H · C · T |
| **`9206`** | Jubilación | BANDEC | B · H · C |
| **`9210`** | Colaboradores | BANDEC | B · H · C · T |
| **`9211`** | Colaboradores | BANDEC | B · H · C · T |
| **`9212`** | Trabajadores por cuenta propia (TCP) | BANDEC | B · H · C |
| **`9213`** | Trabajadores por cuenta propia (TCP) | BANDEC | B · H · C |
| **`9216`** | Subsidios | BANDEC | B · H · C |
| **`9224`** | Nómina, fondos, ahorro ⁴ | BANDEC, Metropolitano | B · H · C · T |
| **`9227`** | Nómina, fondos, ahorro ⁵ | BANDEC, Metropolitano | B · H · C · T |
| **`9233`** | MIPYMES / cooperativas no agropecuarias | BANDEC | B · H · C |
| **`9234`** | Nómina | BANDEC, Metropolitano | C · T |
| **`9237`** | Agricultores / usufructuarios | BANDEC | B · H · C |
| **`9238`** | Ahorro | BPA | C · T |
| **`9244`** | _Sin identificar_ · [¿la tienes?](https://github.com/qvapay/cuban_cards_prefixes/issues/new?template=prefijo.yml&prefix=9244) | — | C |
| **`9248`** | _Sin identificar_ · [¿la tienes?](https://github.com/qvapay/cuban_cards_prefixes/issues/new?template=prefijo.yml&prefix=9248) | — | C |
| **`9550`** | AIS CUP ⁶ | AIS | A · FX |

> ¹ **`9200`**: El catálogo comunitario y la nota de BANDEC la describen como «Tarjeta en CUP», sin propósito concreto. Titulares la confirman en BANDEC (issue #9) y en Banco Metropolitano (issue #14). Un titular reporta que son las antiguas tarjetas en CUC, que pasaron a CUP al retirarse esa moneda (issue #14); falta otra fuente que lo confirme.
>
> ² **`9204`**: BPA confirmado por un titular con su tarjeta (9204 1299), reportada directamente al mantenedor el 2026-10-21.
>
> ³ **`9205`**: Banco Metropolitano y BPA confirmados por titulares (issues #18 y #12).
>
> ⁴ **`9224`**: Banco Metropolitano confirmado por un titular en el issue #10.
>
> ⁵ **`9227`**: Banco Metropolitano confirmado por un titular en el issue #8.
>
> ⁶ **`9550`**: Cuando se emitió era en CUC. Con la eliminación del CUC pasó a CUP, según el aviso de FINCIMEX.

### 💵 USD con respaldo en MLC

| Prefijo | Producto | Confirmado en | Fuentes |
|:-:|---|---|:-:|
| **`9225`** | Ahorro de personas naturales | BANDEC | B · H · C |
| **`9226`** | TCP / productores agropecuarios | BANDEC | B · H · C |
| **`9228`** | Cooperativas / MIPYMES | BANDEC | B · H · C |
| **`9229`** | Otras entidades ¹ | BANDEC | B · H · C |
| **`9235`** | Ahorro de personas naturales | BANDEC | B · H · C |
| **`9245`** | _Sin identificar_ · [¿la tienes?](https://github.com/qvapay/cuban_cards_prefixes/issues/new?template=prefijo.yml&prefix=9245) | — | C |
| **`9250`** | Cooperativas / MIPYMES ² | BANDEC | C · H |

> ¹ **`9229`**: El catálogo comunitario la describe como «Personas jurídicas».
>
> ² **`9250`**: La nota de BANDEC que reproduce el portal de La Habana la agrupa con la 9228.

### 💳 USD

| Prefijo | Producto | Confirmado en | Fuentes |
|:-:|---|---|:-:|
| **`9240`** | Prepago en USD · «Tropical» ¹ | BANDEC | B · H · C · D |
| **`9760`** | Clásica · `976004` Clásica Empresarial ² | FINCIMEX | C · T · CE |
| **`9560`** | AIS USD | AIS | A |

> ¹ **`9240`**: Prepago en USD sin respaldo en MLC. Directorio Cubano (2025) la describe como la tarjeta prepago en dólares de BANDEC, antes conocida como «9240», y la distingue de la 9225 y la 9235, conocidas como tarjetas en MLC. BANDEC la agrupa con las tarjetas en USD con respaldo en MLC y, en la nota que reproduce el portal de La Habana, la llama «Tropical». El catálogo comunitario también la llama «Tropical» y la clasifica como prepago en USD. Solo se conoce en BANDEC.
>
> ² **`9760`**: No sigue la estructura RED: los dígitos 5–8 no son un código de banco. Los dígitos 5–6 distinguen 976003 (Clásica, reportada en el issue #5 y en el PR #6) de 976004 (Clásica Empresarial).
<!-- prefixes:end -->

**Confirmado en** son los bancos en los que una fuente confirma ese producto. No es una lista cerrada: el mismo producto puede existir en otros bancos, y los validadores lo aceptan en cualquier banco conocido. Las letras de **Fuentes** se explican en [Fuentes](#-fuentes).

## ✅ Validar un número

```mermaid
flowchart LR
  A["Lo que escribe<br>el usuario"] --> B["Quitar espacios,<br>guiones y puntos"]
  B --> C{"¿Coincide con<br>un patrón?"}
  C -- sí --> D{"¿Pasa<br>Luhn?"}
  D -- sí --> E["✅ Tarjeta<br>cubana válida"]
  C -- no --> X["❌ No es válida"]
  D -- no --> X
```

1. **Normaliza** el número: quita lo que indica `normalize.strip_pattern`.
2. **Compara** con un patrón de `validators.json`.
3. **Comprueba el dígito de control** Luhn. Una expresión regular no puede hacerlo, pero son pocas líneas de código.

| Patrón | Acepta |
|---|---|
| `patterns.any` | Cualquier tarjeta cubana del catálogo |
| `patterns.red` | Cualquier tarjeta de la red RED |
| `patterns.cup` | Tarjetas en CUP |
| `patterns.usd` | Tarjetas en USD, incluidas la Clásica y la AIS en USD |
| `patterns.usd_mlc` | Tarjetas en USD con respaldo en MLC |
| `patterns.clasica` | Tarjeta Clásica, incluida la Clásica Empresarial |
| `patterns.clasica_empresarial` | Clásica Empresarial (`976004`) |
| `patterns.ais_cup` | Tarjeta AIS en CUP (`9550`) |
| `patterns.ais_usd` | Tarjeta AIS en USD (`9560`) |
| `issuers.<BANCO>` | Tarjetas RED de ese banco |

Además, `variants` da el producto de los prefijos de 6 dígitos que se distinguen de su prefijo de 4, como `976004`, la Clásica Empresarial.

Los patrones usan `[0-9]` en lugar de `\d`, porque en Python y en otros motores `\d` también acepta dígitos que no son ASCII. Funcionan igual en JavaScript, Python, PHP, Java, Go, Dart y Ruby.

<details open>
<summary><b>JavaScript</b></summary>

Pasa el número como cadena: un `Number` de 16 dígitos pierde precisión. `kind` debe ser una cadena con una clave de `v.patterns`, en minúsculas. Un tipo desconocido lanza `RangeError` con la lista de valores admitidos.

```js
const BASE = 'https://cdn.jsdelivr.net/gh/qvapay/cuban_cards_prefixes@main'
const [catalog, v] = await Promise.all(
  ['prefixes.json', 'validators.json'].map(f => fetch(`${BASE}/${f}`).then(r => r.json()))
)

const luhn = (n) => {
  let sum = 0
  for (let i = 0; i < n.length; i++) {
    let d = Number(n[n.length - 1 - i])
    if (i % 2) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  return sum % 10 === 0
}

const normalize = (raw) => String(raw ?? '').replace(new RegExp(v.normalize.strip_pattern, 'g'), '')

// kind: any | red | cup | usd | usd_mlc | clasica | clasica_empresarial | ais_cup | ais_usd
const isCubanCard = (raw, kind = 'any') => {
  if (typeof kind !== 'string' || !Object.hasOwn(v.patterns, kind)) {
    throw new RangeError(`kind inválido: ${String(kind)}. Usa: ${Object.keys(v.patterns).join(', ')}`)
  }
  const n = normalize(raw)
  return new RegExp(v.patterns[kind]).test(n) && luhn(n)
}

// { prefix, currency, mlc_backed, product, bank } o null
const describe = (raw) => {
  const n = normalize(raw)
  if (!isCubanCard(n)) return null
  const p = catalog.prefixes.find(p => p.prefix === n.slice(0, 4))
  const bank = Object.keys(v.issuers).find(id => new RegExp(v.issuers[id]).test(n)) ?? p.issuers[0] ?? null
  const product = v.variants?.[n.slice(0, 6)]?.product ?? p.product
  return { prefix: p.prefix, currency: p.currency, mlc_backed: p.mlc_backed, product, bank }
}

describe('9205 0699 0000 0000')
// { prefix: '9205', currency: 'CUP', mlc_backed: false, product: 'Ahorro', bank: 'BANDEC' }
```

</details>

<details>
<summary><b>Python</b></summary>

```python
import json, re, urllib.request

BASE = 'https://cdn.jsdelivr.net/gh/qvapay/cuban_cards_prefixes@main'

def load(name):
    with urllib.request.urlopen(f'{BASE}/{name}') as r:
        return json.load(r)

catalog, v = load('prefixes.json'), load('validators.json')

def luhn(n):
    total = 0
    for i, ch in enumerate(reversed(n)):
        d = int(ch)
        if i % 2:
            d = d * 2 - 9 if d > 4 else d * 2
        total += d
    return total % 10 == 0

def normalize(raw):
    return re.sub(v['normalize']['strip_pattern'], '', str(raw or ''))

def is_cuban_card(raw, kind='any'):
    n = normalize(raw)
    return re.match(v['patterns'][kind], n) is not None and luhn(n)

def describe(raw):
    n = normalize(raw)
    if not is_cuban_card(n):
        return None
    p = next(p for p in catalog['prefixes'] if p['prefix'] == n[:4])
    bank = next((bank for bank, pattern in v['issuers'].items() if re.match(pattern, n)), None)
    variant = v.get('variants', {}).get(n[:6], {})
    return {
        'prefix': p['prefix'],
        'currency': p['currency'],
        'mlc_backed': p['mlc_backed'],
        'product': variant.get('product', p['product']),
        'bank': bank or next(iter(p['issuers']), None),
    }

describe('9205 0699 0000 0000')
# {'prefix': '9205', 'currency': 'CUP', 'mlc_backed': False, 'product': 'Ahorro', 'bank': 'BANDEC'}
```

</details>

<details>
<summary><b>PHP</b></summary>

Un `$kind` desconocido lanza `InvalidArgumentException` con la lista de valores admitidos. El modificador `u` hace que `\s` también quite los espacios Unicode, como el espacio duro que traen los números copiados de una web.

```php
<?php
$base = 'https://cdn.jsdelivr.net/gh/qvapay/cuban_cards_prefixes@main';
$v = json_decode(file_get_contents("$base/validators.json"), true);

function luhn(string $n): bool {
    $sum = 0;
    foreach (array_reverse(str_split($n)) as $i => $ch) {
        $d = (int) $ch;
        if ($i % 2) { $d *= 2; if ($d > 9) $d -= 9; }
        $sum += $d;
    }
    return $sum % 10 === 0;
}

function normalizeCard(string $raw, array $v): string {
    return preg_replace('/' . $v['normalize']['strip_pattern'] . '/u', '', $raw) ?? '';
}

// $kind: any | red | cup | usd | usd_mlc | clasica | clasica_empresarial | ais_cup | ais_usd
function isCubanCard(string $raw, array $v, string $kind = 'any'): bool {
    if (!array_key_exists($kind, $v['patterns'])) {
        throw new InvalidArgumentException('kind inválido: ' . $kind . '. Usa: ' . implode(', ', array_keys($v['patterns'])));
    }
    $n = normalizeCard($raw, $v);
    return preg_match('/' . $v['patterns'][$kind] . '/', $n) === 1 && luhn($n);
}

// 'BANDEC' | 'BPA' | 'METROPOLITANO' | 'BICSA' | null
function bankOf(string $raw, array $v): ?string {
    $n = normalizeCard($raw, $v);
    if (!isCubanCard($n, $v, 'red')) return null;
    foreach ($v['issuers'] as $id => $pattern) {
        if (preg_match('/' . $pattern . '/', $n) === 1) return $id;
    }
    return null;
}

var_dump(isCubanCard('9205 0699 0000 0000', $v, 'cup')); // bool(true)
var_dump(bankOf('9205-0699-0000-0000', $v));             // string(6) "BANDEC"
```

</details>

## 📦 Formato de los datos

Cada prefijo de `prefixes.json` tiene esta forma:

```json
{
  "prefix": "9240",
  "network": "RED",
  "currency": "USD",
  "mlc_backed": false,
  "product": "Prepago en USD",
  "aliases": ["Tropical"],
  "issuers": ["BANDEC"],
  "sources": ["bandec_post", "lahabana_bandec", "community_catalog", "directoriocubano_tropical"],
  "notes": "Prepago en USD sin respaldo en MLC. Directorio Cubano (2025) la describe como la tarjeta prepago en dólares de BANDEC, antes conocida como «9240», y la distingue de la 9225 y la 9235, conocidas como tarjetas en MLC. BANDEC la agrupa con las tarjetas en USD con respaldo en MLC y, en la nota que reproduce el portal de La Habana, la llama «Tropical». El catálogo comunitario también la llama «Tropical» y la clasifica como prepago en USD. Solo se conoce en BANDEC."
}
```

| Campo | Qué es |
|---|---|
| `prefix` | Los 4 primeros dígitos |
| `network` | `RED`, o `null` si el producto no sigue la estructura RED (la Clásica y las AIS) |
| `currency` | `CUP` o `USD` |
| `mlc_backed` | `true` si es USD con respaldo en MLC, como lo llama BANDEC. `null` si no se sabe |
| `product` | Producto o propósito. `null` si todavía no se ha identificado |
| `aliases` | Otros nombres con los que se conoce |
| `issuers` | Bancos en los que una fuente confirma el producto |
| `variants` | Opcional. Prefijos de 6 dígitos con otro producto, cada uno con `prefix`, `product`, `aliases`, `sources` y `notes`. Hoy solo la Clásica Empresarial (`976004`) |
| `sources` | Fuentes de ese dato (lista `sources` al final del fichero) |
| `notes` | Aclaraciones y contradicciones entre fuentes |

En `issuers`, el campo `code` son los dígitos del banco a partir de la posición 5. Si tiene menos de 4 dígitos, el resto todavía no se conoce.

## 🔖 Versiones y compatibilidad

Hay apps que leen estos ficheros directamente desde `@main`, así que cuidamos qué cambia de una versión a otra. La versión está en `prefixes.json` y en `validators.json`, y cada cambio se anota en el [registro de cambios](CHANGELOG.md).

| Cambio | ¿Afecta a tu integración? |
|---|---|
| Prefijos, bancos, fuentes o campos opcionales nuevos, o un `product` que deja de ser `null` | No |
| Claves nuevas en `validators.json` | No |
| Una corrección de datos que cambia lo que aceptan los patrones | Puede: un número que antes pasaba deja de pasar, o al revés. Se anota en el registro de cambios. Por ejemplo, en la 0.2.0 Banco Metropolitano pasó de `95··` a `9598`. |
| Cambiar el formato o el significado de un campo, o renombrar o quitar una clave | Sí. Lo evitamos, y si algún día hace falta se avisará con una versión mayor. |

Para que nada cambie sin que lo decidas tú, fija una versión en la URL:

```text
https://cdn.jsdelivr.net/gh/qvapay/cuban_cards_prefixes@v0.5.0/validators.json
```

## 📚 Fuentes

<!-- sources:start -->
| | Fuente | Qué aporta |
|:-:|---|---|
| **B** | ¿Sabías que los dígitos de tu tarjeta Bandec revelan su propósito? | Publicación atribuida a BANDEC sobre los dígitos 3–4 de sus tarjetas. El portal del Gobierno de La Habana la reproduce (fuente H). |
| **H** | [Cómo identificar tarjetas bancarias en Cuba por sus dígitos](https://www.lahabana.gob.cu/post_detalles/es/29956/como-identificar-tarjetas-bancarias-en-cuba-por-sus-digitos) | Portal del Ciudadano de La Habana (7 de agosto de 2026). Reproduce la nota de BANDEC con los mismos prefijos en CUP y en USD, incluye la 9250 junto a la 9228 y llama «Tropical» a la 9240. Aportado en el issue #11. |
| **C** | Cuban Bank Card Prefixes v1.0.0 (2026-06-20) | Catálogo comunitario. Para la estructura del número cita el documento «Tomo 2 Digital». |
| **T** | Titulares de tarjeta | Titulares que confirman el código de banco de BANDEC (0699), BPA (1299) y Banco Metropolitano (9598); las tarjetas BANDEC 9210 y 9211; la 9200 en BANDEC y Banco Metropolitano; la 9204 de nómina en BPA; la 9205 de ahorro en BPA y Banco Metropolitano; la 9224, la 9227 y la 9234 en Banco Metropolitano; la 9238 de ahorro en BPA, y la Clásica 976003 (issues #1, #2, #4, #8, #9, #10, #12, #14 y #18; PR #6). |
| **F** | [Kubaforum: «Überweisung mit Sparkasse auf BPA-Konto»](https://www.kubaforum.eu/artikel/ueberweisung-mit-sparkasse-auf-bpa-konto.35643/) | Hilo de foro en alemán (diciembre de 2023). Da los dígitos 5–8 de BANDEC (0699), BPA (1299) y Banco Metropolitano (9598). Aportado en el issue #3. |
| **CE** | [Informa Financiera CIMEX S.A. sobre ampliación de posibilidades de uso de tarjeta Clásica Empresarial](http://www.cubadebate.cu/noticias/2025/04/04/informa-financiera-cimex-s-a-sobre-ampliacion-de-posibilidades-de-uso-de-tarjeta-clasica-empresarial/) | Confirma la existencia de la Clásica Empresarial de FINCIMEX; no publica el prefijo 976004. |
| **A** | [Cimex responde a usuarios sobre dudas con respecto a las tarjetas AIS (Directorio Cubano, 2020)](https://www.directoriocubano.info/panorama/cimex-responde-a-usuarios-sobre-dudas-con-respecto-a-las-tarjetas-ais) | Cimex confirma que las tarjetas AIS empiezan por 9550 (entonces en CUC) y 9560 (USD). Aportada en el PR #16. |
| **FX** | [FINCIMEX: «Aclaración a nuestros clientes»](https://www.facebook.com/fincimex/posts/aclaraci%C3%B3n-a-nuestros-clienteslos-clientes-de-tarjetas-ais-no-tendr%C3%A1n-que-presen/752525275358296/) | Aviso en la cuenta oficial de FINCIMEX en Facebook: las tarjetas AIS en CUC pasan a CUP. Aportada en el PR #16. |
| **D** | [¿Conoces la tarjeta Tropical en dólares de Cuba? Banco informa sobre este producto (Directorio Cubano, 2025)](https://www.directoriocubano.info/panorama/conoces-la-tarjeta-tropical-en-dolares-de-cuba-banco-informa-sobre-este-producto/) | La 9240 («Tropical») es la tarjeta prepago en dólares de BANDEC, distinta de la 9225 y la 9235, conocidas como tarjetas en MLC. Aportada en el PR #16. |
| **ISO** | [ISO/IEC 7812-1: números de identificación de tarjetas](https://en.wikipedia.org/wiki/ISO/IEC_7812) | El último dígito de un número de tarjeta es un dígito de control Luhn. |
<!-- sources:end -->

## 🔍 Ayúdanos a completarlo

- El producto de los prefijos marcados como _Sin identificar_ en las tablas.
- Los dígitos 7–8 de BICSA.
- La entidad emisora de la Clásica y qué significan sus dígitos 5–8.
- Una tarjeta Clásica Empresarial que confirme el `976004`. Hoy sale de la lógica de Transfermóvil analizada en el [#5](https://github.com/qvapay/cuban_cards_prefixes/issues/5).
- El enlace a la publicación original de BANDEC (el portal del Gobierno de La Habana la reproduce: fuente **H**).

¿Tienes una de esas tarjetas o una fuente? [Cuéntanoslo](https://github.com/qvapay/cuban_cards_prefixes/issues/new?template=prefijo.yml).

## 🙌 Quién ha aportado

Este catálogo crece con lo que comparte la comunidad. Muchos reportes llegan desde el [Explorador de tarjetas cubanas](https://rblez.github.io/explorador-tarjetas-cubanas/) de [@rblez](https://github.com/rblez), que consume este catálogo en vivo y permite reportar un prefijo con un clic. Gracias a:

| Quién | Qué aportó |
|---|---|
| [@edyermorales](https://github.com/edyermorales) | La `9234` de nómina en BANDEC y la `9238` de ahorro en BPA ([#1](https://github.com/qvapay/cuban_cards_prefixes/issues/1), [#2](https://github.com/qvapay/cuban_cards_prefixes/issues/2)). |
| [@armandofcom](https://github.com/armandofcom) | El código `9598` de Banco Metropolitano, con el hilo de Kubaforum que lo documenta ([#3](https://github.com/qvapay/cuban_cards_prefixes/issues/3)). |
| [@Y4S3L23](https://github.com/Y4S3L23) | La confirmación, con su propia tarjeta, del `9598` y de la `9234` en Banco Metropolitano ([#4](https://github.com/qvapay/cuban_cards_prefixes/issues/4)). |
| [@livegnik97](https://github.com/livegnik97) | La pista de la Clásica Empresarial (`976004`) a partir de la lógica de Transfermóvil ([#5](https://github.com/qvapay/cuban_cards_prefixes/issues/5)) y el enlace oficial a la nota de BANDEC ([#11](https://github.com/qvapay/cuban_cards_prefixes/issues/11)). |
| [@drlorente97](https://github.com/drlorente97) | El `976003` de la Clásica ([#6](https://github.com/qvapay/cuban_cards_prefixes/pull/6)), las tarjetas AIS (`9550` y `9560`) con el aviso de FINCIMEX sobre su paso a CUP, y la Tropical (`9240`) como prepago en USD ([#16](https://github.com/qvapay/cuban_cards_prefixes/pull/16)). |
| [@Chichimokers](https://github.com/Chichimokers) | Las variantes por los dígitos 5–6 y la Clásica Empresarial (`976004`), con el aviso de CIMEX que la documenta ([#7](https://github.com/qvapay/cuban_cards_prefixes/pull/7)), y la `9227` en Banco Metropolitano ([#8](https://github.com/qvapay/cuban_cards_prefixes/issues/8)). |
| [@xero-q](https://github.com/xero-q) | La `9205` de ahorro en Banco Metropolitano, confirmada con su tarjeta ([#18](https://github.com/qvapay/cuban_cards_prefixes/issues/18)). |
| [@rblez](https://github.com/rblez) | El [Explorador de tarjetas cubanas](https://rblez.github.io/explorador-tarjetas-cubanas/), desde el que llegan muchos reportes, y la `9200` en BANDEC ([#9](https://github.com/qvapay/cuban_cards_prefixes/issues/9)). |
| [@vcarv7](https://github.com/vcarv7) | La `9224` en Banco Metropolitano, confirmada con su tarjeta ([#10](https://github.com/qvapay/cuban_cards_prefixes/issues/10)). |
| [@ecejas](https://github.com/ecejas) | El arreglo de los ejemplos JavaScript y PHP del README, que aceptaban cualquier número con un `kind` desconocido, y las pruebas que ahora los ejecutan en CI ([#21](https://github.com/qvapay/cuban_cards_prefixes/pull/21)). |
| [@aalvarezcbr](https://github.com/aalvarezcbr) | La `9205` de ahorro en BPA, confirmada con su tarjeta ([#12](https://github.com/qvapay/cuban_cards_prefixes/issues/12)). |
| [@earlyhp-qvapay](https://github.com/earlyhp-qvapay) | La `9200` en Banco Metropolitano y la pista de que son las antiguas tarjetas en CUC ([#14](https://github.com/qvapay/cuban_cards_prefixes/issues/14)). |

¿Tienes una tarjeta que falta o una fuente? [Cuéntanoslo](https://github.com/qvapay/cuban_cards_prefixes/issues/new?template=prefijo.yml) y apareces aquí.

## 🤝 Contribuir

- **Con un issue**: el formulario de [nuevo prefijo o corrección](https://github.com/qvapay/cuban_cards_prefixes/issues/new?template=prefijo.yml) pide los 8 primeros dígitos, el banco, la moneda, el producto y la fuente.
- **Con un pull request**:
  1. Parte de la última versión de `main` y trata un solo tema por pull request: así se revisa y se integra antes.
  2. Edita `prefixes.json` y cita la fuente de cada dato: un enlace al documento original, un documento o tu propia tarjeta. Tiene que ser algo que otra persona pueda comprobar.
  3. No cambies el formato ni el significado de los campos que ya existen, ni renombres claves de `validators.json`: hay apps que dependen de ellos. Si hace falta algo nuevo, añádelo como campo opcional. Ver [Versiones y compatibilidad](#-versiones-y-compatibilidad).
  4. Ejecuta `npm run build`. Regenera `validators.json` y las tablas de este README.
  5. Ejecuta `npm run check`. Comprueba que el catálogo es coherente y que lo generado está al día. Lo mismo corre en cada pull request.

Cuando integramos tu aporte, apareces en [Quién ha aportado](#-quién-ha-aportado).

> [!WARNING]
> **Nunca publiques un número de tarjeta completo** en un issue, un pull request o un commit. Para identificar un producto bastan los 8 primeros dígitos.

## 🇺🇸 English

<details>
<summary>Summary in English</summary>

An open catalog of **Cuban bank card prefixes**: which product, currency and bank sit behind the first digits of a Cuban card, plus ready-to-use validators for any language.

- [`prefixes.json`](prefixes.json): the catalog (card structure, banks, prefixes and sources). Texts are in Spanish.
- [`validators.json`](validators.json): regular expressions generated from the catalog, by currency (`cup`, `usd`, `usd_mlc`, `clasica`, `clasica_empresarial`, `ais_cup`, `ais_usd`, `any`) and by bank (`BANDEC`, `BPA`, `METROPOLITANO`, `BICSA`), plus a `variants` map for 6-digit prefixes such as `976004` (Clásica Empresarial).
- [`schema.json`](schema.json): JSON Schema 2020-12 for `prefixes.json`.

Cards on the Cuban **RED** network have 16 digits: digits 1–2 are the network (`92`), 3–4 the product and currency, 5–8 the bank (`0699` BANDEC, `1299` BPA, `9598` Banco Metropolitano), 9–15 the account and 16 a Luhn check digit.

To validate a number: strip spaces, hyphens and dots (`normalize.strip_pattern`), match it against a pattern and check the Luhn digit. See the code samples above.

To avoid unannounced changes, pin a version with `@v0.5.0` instead of `@main`. Every change is listed in [CHANGELOG.md](CHANGELOG.md).

This is a community catalog, not an official source. Never post a full card number in an issue or pull request: the first 8 digits are enough.

</details>

---

<div align="center">
<sub>Hecho con 💙 por la comunidad · Mantenido por <a href="https://qvapay.com">QvaPay</a> · <a href="LICENSE">Licencia MIT</a></sub>
</div>
