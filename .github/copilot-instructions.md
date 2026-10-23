# Instrukcje Copilota

## Przegląd projektu

Aplikacja w Astro v6 („Mayhem w Stoczni”), która porównuje wykresy kontrybucji dwóch użytkowników GitHuba. Tekst interfejsu jest po polsku.

- `src/pages/index.astro` — strona pojedynku: formularz (Gracz 1, Gracz 2, „Walcz!”, `novalidate` — błędy pokazuje skrypt po polsku), obszar `#results`, skrypt kliencki wywołujący `/api/contributions/<user>` dla obu graczy; wyniki renderowane bez `innerHTML`.
- `src/styles/arena.css` — cały wygląd (pixelartowa stocznia nocą); zawiera paletę jako zmienne CSS (`--bg`, `--crane`, `--crane-dim`, `--amber`, `--rust`, `--steel`, `--text`).
- `src/components/` — dekoracyjne komponenty SVG (`crispEdges`, `aria-hidden`): `Skyline`, `Zuraw`, `Monument`, `Harbor`, `Crest`.
- `src/lib/contributions.ts` — interfejsy TypeScript odpowiedzi `.contribs`.
- `src/lib/streak.ts` — `longestStreak` liczy najdłuższą serię dni z kontrybucjami.
- `src/pages/api/contributions/[username].ts` — proxy `GET` do `https://github.com/{username}.contribs`: waliduje nazwę (400), przekazuje JSON bez zmian, mapuje błędy na 404/429/502/504 i ustawia `Cache-Control` oraz `X-Cache` (HIT/MISS).
- `src/lib/ttl-cache.ts` — cache w pamięci z TTL (600 s) i deduplikacją równoległych żądań, używany przez proxy.
- `astro.config.mjs` — `output: 'server'` z adapterem `@astrojs/node` w trybie `standalone`.

## Komendy

- `npm install` — instalacja zależności
- `npm run dev` — serwer deweloperski (domyślnie http://localhost:4321)
- `npm run build` — build produkcyjny do `dist/`
- `npm run preview` — podgląd builda

Nie ma skonfigurowanych testów ani lintera.

## Dobre praktyki Astro

- Trasy API muszą mieć `export const prerender = false;` (projekt działa w trybie `server`).
- Handlery typuj przez `APIRoute` z `astro`; parametry dynamiczne czytaj z `params`.
- Błędy z API zwracaj jako JSON `{ error: string }` z właściwym statusem i nagłówkiem `Content-Type: application/json`.
- Logikę po stronie serwera trzymaj we frontmatterze `.astro` lub w trasach API; skrypty klienckie dodawaj przez `<script>`.
- Elementy tworzone w skrypcie klienckim (karty, siatki, loader) nie dostają zawężonych stylów Astro (`data-astro-cid`) — ich style trzymaj w globalnym `src/styles/arena.css`, a kolory bierz ze zmiennych palety zamiast wpisywać wartości.
- Poziom dnia kontrybucji ustawiaj przez `data-level` (0–4), a nie przez inline `background-color`.
- Pliki statyczne umieszczaj w `public/`.

## Motyw wizualny: gdańska stocznia nocą

Każdy nowy element interfejsu ma trzymać się estetyki pixelartowej stoczni (retro 8/16-bit, port nocą); nie dodawaj elementów w „generycznym” stylu.

- **Paleta** (zmienne CSS na `:root` w `src/styles/arena.css`; używaj `var(--…)`, odcienie pochodne tylko przez `color-mix`):
  - `--bg: #0d1117` — noc nad stocznią
  - `--crane: #3fb950` — zieleń dźwigów
  - `--crane-dim: #2ea043`
  - `--amber: #e3b341` — dach Żurawia, skrzynie, akcenty
  - `--rust: #b45309` — cegła, rdza
  - `--steel: #8b949e` — konstrukcje, nabrzeże
  - `--text: #e6edf3`
- **Fonty:** nagłówki, tytuł, „VS” i etykiety w `Press Start 2P`; tekst, pola i liczby w `JetBrains Mono` (oba z Google Fonts, fallback `monospace`).
- **Kształty:** bez zaokrągleń (`border-radius: 0`), twarde cienie, grafiki SVG z `shape-rendering: crispEdges`, dekoracje z `aria-hidden="true"`.
- **Animacje:** subtelne, wolne i o małej amplitudzie (tylko `transform`/`opacity`, często `steps()`); nie mogą utrudniać czytania danych o kontrybucjach, bez poświaty i ruchu na samym tekście danych. Zawsze wyłączaj je w `@media (prefers-reduced-motion: reduce)`.
- **Motywy:** suwnice, skrzynie ładunkowe (poziom kontrybucji = `data-level`), hak dźwigu, bursztyn, cegła Głównego Miasta; teksty interfejsu po polsku.
