# Stargate Frontend

Next.js marketing site, merchant dashboard, public payment pages, wallet integration, webhook settings, and embeddable widget.

The frontend follows the Stargate design prompt kit: dark fintech hero, B2B navigation, transactions, payment links, wallets, webhooks, team controls, developer docs, hosted checkout, and the widget SDK.

## Local Development

```sh
cp .env.local.example .env.local
npm install
npm run dev
```

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run build:widget
```

The from-scratch product prompt kit lives at `../docs/stargate-product-build-prompts.md`.

## Production

```sh
cp .env.production.example .env.production
npm run build
npm run build:widget
```

`vercel.json` contains the production build command, global security headers, hosted-checkout frame policy, and widget rewrite used by the deployment workflow.

Production deploys require these GitHub secrets on `dreamgeneX/stargate-frontend`:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Production URLs should be stored as GitHub repository variables:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`

## Environment Variables

The frontend application is configured via the following environment variables:

| Variable | Type | Default | Usage / Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `string` (URL) | `http://localhost:3001` | Base API URL for frontend interactions. Used in [api.ts](file:///Users/admin/.pg/stellar-W5/stargate-frontend/lib/api.ts) for general API calls and [sse.ts](file:///Users/admin/.pg/stellar-W5/stargate-frontend/lib/sse.ts) to establish payment confirmation streams. |
| `NEXT_PUBLIC_APP_URL` | `string` (URL) | `http://localhost:3000` | The public-facing domain URL of the frontend console. Used in [developers/page.tsx](file:///Users/admin/.pg/stellar-W5/stargate-frontend/app/dashboard/developers/page.tsx) to generate webhook endpoints, copyable integration scripts, and SDK configuration details. |
| `NEXT_PUBLIC_STELLAR_NETWORK` | `'testnet' \| 'mainnet'` | `testnet` | Specifies the default target Stellar network environment. Used in transaction signing configurations, Horizon endpoints construction, and fallback parameters. |

> **Note**: Never put secrets or private keys in these variables. All variables prefixed with `NEXT_PUBLIC_` are bundled into the client-side code and exposed to the browser.

## Documentation & Customisation Guides

For detailed integration and styling guides, refer to the following documentation:

- [Widget SDK & Event Schema](file:///Users/admin/.pg/stellar-W5/stargate-frontend/docs/widget-sdk.md) — Event schemas (`STARGATE_LOADED`, `STARGATE_PAID`, `STARGATE_ERROR`), `postMessage` details, and embedding code.
- [Theming & Branding Customisation Guide](file:///Users/admin/.pg/stellar-W5/stargate-frontend/docs/theming-and-branding.md) — Complete walkthrough on how to override CSS variables, customize brand colors, support dark mode, and customize fonts for the hosted checkout page.

## License

MIT

