import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CreateDealInput } from '../models/create-deal-input.model';
import { Deal } from '../models/deal.model';
import { DealApiRequestError, DealApiValidationError } from './deal-api.errors';
import { mapCreateDealInputToBody, mapDealDtoToDeal } from './deal.mapper';
import { dealDtoListSchema, dealDtoSchema } from './deal.schema';

/** Caps hung MockAPI requests so store `finalize` can clear loading/creating. */
export const DEAL_API_REQUEST_TIMEOUT_MS = 10_000;

/**
 * Thin HTTP client for the MockAPI `deals` resource.
 *
 * Responses are validated with Zod before they enter the domain. Angular form
 * validators continue to own interactive rules; this layer only rejects bad
 * wire data.
 */
@Injectable({
  providedIn: 'root',
})
export class DealsApiService {
  private readonly http = inject(HttpClient);
  private readonly dealsUrl = `${environment.apiBaseUrl}/deals`;

  getDeals(): Observable<readonly Deal[]> {
    return this.http.get<unknown>(this.dealsUrl).pipe(
      timeout(DEAL_API_REQUEST_TIMEOUT_MS),
      map((body) => {
        const parsed = dealDtoListSchema.safeParse(body);

        if (!parsed.success) {
          throw new DealApiValidationError();
        }

        return parsed.data.map(mapDealDtoToDeal);
      }),
      catchError((error: unknown) => this.mapToApiError(error)),
    );
  }

  createDeal(input: CreateDealInput): Observable<Deal> {
    return this.http.post<unknown>(this.dealsUrl, mapCreateDealInputToBody(input)).pipe(
      timeout(DEAL_API_REQUEST_TIMEOUT_MS),
      map((body) => {
        const parsed = dealDtoSchema.safeParse(body);

        if (!parsed.success) {
          throw new DealApiValidationError();
        }

        return mapDealDtoToDeal(parsed.data);
      }),
      catchError((error: unknown) => this.mapToApiError(error)),
    );
  }

  private mapToApiError(error: unknown): Observable<never> {
    if (error instanceof DealApiValidationError) {
      return throwError(() => error);
    }

    return throwError(() => new DealApiRequestError());
  }
}
