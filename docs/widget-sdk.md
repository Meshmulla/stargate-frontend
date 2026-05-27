# Widget SDK — postMessage Event Schema

The Stargate payment widget communicates with the parent window via the
[`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
API. This document lists every event the widget emits, the shape of each
payload, and example code for listening to them.

---

## Events

### 1. `STARGATE_LOADED`

Fired when the widget has finished mounting and is ready for interaction.

**Payload**

```typescript
{
  type: 'STARGATE_LOADED';
  invoiceId: string;
}
```

**Example**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'STARGATE_LOADED') {
    console.log('Widget ready for invoice', event.data.invoiceId);
  }
});
```

---

### 2. `STARGATE_PAID`

Fired when the payer has successfully submitted a Stellar transaction and the
payment has been confirmed by the backend.

**Payload**

```typescript
{
  type: 'STARGATE_PAID';
  invoiceId: string;
  txHash: string;
}
```

| Field      | Type     | Description                              |
| ---------- | -------- | ---------------------------------------- |
| `invoiceId` | `string` | The unique identifier of the invoice.    |
| `txHash`    | `string` | The Stellar transaction hash.            |

**Example**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'STARGATE_PAID') {
    console.log('Payment complete!', {
      invoice: event.data.invoiceId,
      transaction: event.data.txHash,
    });
    // Redirect to a thank-you page or show a success message.
  }
});
```

---

### 3. `STARGATE_ERROR`

Fired when an error occurs during the payment flow (e.g., wallet connection
failure, transaction signing error, compliance screening rejection).

**Payload**

```typescript
{
  type: 'STARGATE_ERROR';
  invoiceId: string;
  code: string;
  message: string;
}
```

| Field      | Type     | Description                                              |
| ---------- | -------- | -------------------------------------------------------- |
| `invoiceId` | `string` | The unique identifier of the invoice.                    |
| `code`      | `string` | Machine-readable error code (see table below).           |
| `message`   | `string` | Human-readable description of what went wrong.           |

**Error codes**

| Code                        | Meaning                                          |
| --------------------------- | ------------------------------------------------ |
| `WALLET_CONNECTION_FAILED`  | Could not connect to the selected wallet.        |
| `WALLET_ACCESS_DENIED`      | User denied the wallet access request.           |
| `COMPLIANCE_BLOCKED`        | The payer's address was blocked by screening.    |
| `TX_PREPARATION_FAILED`     | Backend could not prepare the Stellar transaction.|
| `TX_SIGNING_FAILED`         | Wallet refused to sign the transaction.          |
| `TX_SUBMISSION_FAILED`      | Horizon rejected the submitted transaction.      |
| `UNKNOWN`                   | An unexpected error occurred.                    |

**Example**

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'STARGATE_ERROR') {
    console.error('Payment error:', event.data.code, event.data.message);
    // Show an inline error message to the user.
  }
});
```

---

## Full listener example

```javascript
// Paste this into the page that embeds the Stargate widget.
window.addEventListener('message', (event) => {
  const { type, invoiceId, txHash, code, message } = event.data;

  switch (type) {
    case 'STARGATE_LOADED':
      console.log(`Widget loaded for invoice ${invoiceId}`);
      break;

    case 'STARGATE_PAID':
      console.log(`Invoice ${invoiceId} paid — tx ${txHash}`);
      // e.g. show a success screen
      break;

    case 'STARGATE_ERROR':
      console.error(`[${code}] ${message}`);
      // e.g. show an error banner
      break;

    default:
      // Ignore unknown messages.
      break;
  }
});
```

---

## Embedding the widget

```html
<iframe
  src="https://checkout.stargate.dev/pay/{invoiceId}"
  width="100%"
  height="600"
  frameborder="0"
  title="Stargate Payment Widget"
></iframe>
```

> **Note:** Always verify `event.origin` in production to prevent cross-origin
> message spoofing. Replace `'https://checkout.stargate.dev'` with your actual
> checkout domain.

```javascript
const ALLOWED_ORIGIN = 'https://checkout.stargate.dev';

window.addEventListener('message', (event) => {
  if (event.origin !== ALLOWED_ORIGIN) return;
  // … handle event …
});
```
