# 🎮 Mayhem w Stoczni — repozytorium startowe

**Warsztat GitHub Copilot CLI** — zbuduj arenę pojedynków na wykresy kontrybucji z GitHuba

To jest **punkt startowy** warsztatu: szkielet aplikacji w Astro, którą krok po kroku
rozbudujesz przy pomocy GitHub Copilota. Gotowa aplikacja porównuje wykresy kontrybucji
dwóch użytkowników GitHuba — w klimacie gdańskiej stoczni.

> 📍 **Instrukcja warsztatu (po polsku):**
> **https://pawel-siwek.github.io/gdn-dev-days-2026/mona-mayhem/?track=cli**

## 🚀 Jak zacząć

1. **Utwórz własne repozytorium** — kliknij **Use this template** → **Create a new repository**.
2. Wybierz sposób pracy:
   - **GitHub Copilot CLI:** sklonuj repo lokalnie, zainstaluj `copilot` i pracuj z terminala.
   - **VS Code:** sklonuj repo i otwórz je w VS Code.
3. Przejdź do [instrukcji warsztatu](https://pawel-siwek.github.io/gdn-dev-days-2026/mona-mayhem/?track=cli).

```bash
npm install
npm run dev
```

## Wymagania wstępne

**Wspólne**

- GitHub Copilot (wystarczy plan darmowy)
- Git
- Node.js

**Ścieżka CLI**

- GitHub Copilot CLI (`copilot`)
- Node.js 22+, jeśli instalujesz CLI przez `npm install -g @github/copilot`
- Albo Homebrew / WinGet, jeśli wolisz natywny menedżer pakietów

**Ścieżka VS Code**

- VS Code v1.107+
- Zalogowane rozszerzenie GitHub Copilot

## Stack technologiczny

- **Framework:** [Astro](https://astro.build/) v6
- **Runtime:** Node.js z adapterem [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/)
- **API:** endpoint wykresów kontrybucji GitHuba

## Wdrożenie aplikacji

GitHub Pages to hosting statyczny, więc żeby opublikować tam aplikację, trzeba przejść na wyjście statyczne:

1. Zmień `output` w `astro.config.mjs` z `server` na `static`.
2. Usuń adapter Node (`@astrojs/node`) z `astro.config.mjs` i `package.json`.
3. Dodaj workflow, który uruchomi `npm ci` i `npm run build`, a potem wyśle `dist/` jako artefakt Pages.
4. Przy publikacji pod `https://<user>.github.io/<repo>/` ustaw `site` i `base` w `astro.config.mjs`.

Jeśli chcesz zachować działające trasy API na produkcji, użyj platformy serwerowej (np. Vercel, Netlify albo hostingu Node) zamiast Pages.

## Pochodzenie

Kopia [`copilot-dev-days/mona-mayhem`](https://github.com/copilot-dev-days/mona-mayhem)
(commit `d376143ca3e6c0b3c63980402deaf1c4ac0a1b19`, licencja MIT), zamrożona i przygotowana
na **GitHub Dev Days Gdańsk**, 28.10.2026. Usunięto instrukcję warsztatu i workflow
publikacji — instrukcja mieszka w [repozytorium materiałów](https://github.com/pawel-siwek/gdn-dev-days-2026).
Pełna atrybucja: [NOTICE.md](https://github.com/pawel-siwek/gdn-dev-days-2026/blob/main/NOTICE.md).

To nie jest oficjalny materiał GitHuba.

## Licencja

MIT — zob. [LICENSE](LICENSE).
