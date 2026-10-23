# Instrukcje Copilota

## Przegląd projektu

Aplikacja w Astro v6 („Mayhem w Stoczni”), która porównuje wykresy kontrybucji dwóch użytkowników GitHuba. Tekst interfejsu jest po polsku.

- `src/pages/index.astro` — strona główna (interfejs).
- `src/pages/api/contributions/[username].ts` — endpoint `GET` pobierający dane z `https://github.com/{username}.contribs` (obecnie zwraca 501).
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
- Pliki statyczne umieszczaj w `public/`.
