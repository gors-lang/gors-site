# GoRs website

[Visit the site](https://gors-lang.github.io/gors-site/) · [GoRs compiler](https://github.com/gors-lang/Gors) · [Language documentation](https://github.com/gors-lang/Gors/blob/main/docs/README.md)

The GoRs programming language website. Try browsing the examples for borrowing,
error handling, and slices, then download any of them as a `.gors` file. The
site also includes a searchable index of documentation topics and a quick start
with release downloads for Linux and Windows.

The frontend uses Angular, TypeScript, and Tailwind CSS 4. Bun manages
dependencies and runs the project scripts.

## Local development

The deployment workflow uses Node.js 26 and Bun 1.4.5.

```sh
bun install --frozen-lockfile
bun run start
```

Open [localhost:4200](http://localhost:4200/) for the development server.
To check a production build with the same base path as GitHub Pages, run:

```sh
bun run build --base-href /gors-site/
```

The static files are written to `dist/gors-site/browser`.

## Deployment

The [GitHub Pages workflow](.github/workflows/pages.yml) builds and publishes
the site on pushes to `main`. It can also be started manually from the
[Actions tab](https://github.com/gors-lang/gors-site/actions/workflows/pages.yml).
