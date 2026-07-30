# Domain model

## Deal

A commercial real-estate investment opportunity.

| Field                | Type     | Notes                                      |
| -------------------- | -------- | ------------------------------------------ |
| `id`                 | `string` | Assigned by MockAPI; never client-invented |
| `name`               | `string` | Display name                               |
| `address`            | `string` | Property address                           |
| `purchasePrice`      | `number` | Acquisition cost in whole USD              |
| `netOperatingIncome` | `number` | Annual NOI in whole USD                    |

Capitalization rate is **not** a stored field. It is derived by
`calculateCapRate(netOperatingIncome, purchasePrice)` wherever it is shown
(table rows, create-form preview).

## CreateDealInput

Payload for creating a deal. Same fields as `Deal` except `id`, which the
server assigns.

## MockAPI wire shape

Resource: `GET|POST {apiBaseUrl}/deals`

Sample response object:

```json
{
  "id": "1",
  "name": "Downtown Commercial Plaza",
  "address": "100 Market Street",
  "purchasePrice": 15000000,
  "netOperatingIncome": 1200000
}
```

Numeric fields may arrive as strings depending on MockAPI field types; Zod
coerces them at the HTTP boundary before mapping into `Deal`.
