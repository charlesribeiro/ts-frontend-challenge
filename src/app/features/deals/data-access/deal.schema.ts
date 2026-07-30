import { z } from 'zod';

/**
 * Accepts JSON numbers and non-empty numeric strings (MockAPI quirk), but
 * rejects empty strings, null, and booleans that `z.coerce.number()` would
 * otherwise turn into 0 or 1.
 */
const wireNumberSchema = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }

  return value;
}, z.number().finite());

/**
 * Wire shape for a deal as returned by MockAPI.
 *
 * Numbers are coerced from non-empty numeric strings because MockAPI may
 * serialize them that way depending on resource configuration. Interactive
 * form rules stay in Angular validators; this schema only guards the HTTP
 * boundary.
 */
export const dealDtoSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string().trim().min(1),
  address: z.string().trim().min(1),
  purchasePrice: wireNumberSchema,
  netOperatingIncome: wireNumberSchema,
});

export const dealDtoListSchema = z.array(dealDtoSchema);

export type DealDto = z.infer<typeof dealDtoSchema>;
