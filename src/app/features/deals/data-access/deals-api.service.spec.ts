import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { DealApiRequestError, DealApiValidationError } from './deal-api.errors';
import { DEAL_API_REQUEST_TIMEOUT_MS, DealsApiService } from './deals-api.service';

const dealsUrl = `${environment.apiBaseUrl}/deals`;

const sampleDto = {
  id: '1',
  name: 'Downtown Commercial Plaza',
  address: '100 Market Street',
  purchasePrice: 15_000_000,
  netOperatingIncome: 1_200_000,
};

describe('DealsApiService', () => {
  let api: DealsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    api = TestBed.inject(DealsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps a validated deal list from GET /deals', () => {
    let result: unknown;

    api.getDeals().subscribe((deals) => {
      result = deals;
    });

    const request = httpMock.expectOne(dealsUrl);
    expect(request.request.method).toBe('GET');
    request.flush([sampleDto, { ...sampleDto, id: 2, name: 'Second Deal' }]);

    expect(result).toEqual([
      {
        id: '1',
        name: 'Downtown Commercial Plaza',
        address: '100 Market Street',
        purchasePrice: 15_000_000,
        netOperatingIncome: 1_200_000,
      },
      {
        id: '2',
        name: 'Second Deal',
        address: '100 Market Street',
        purchasePrice: 15_000_000,
        netOperatingIncome: 1_200_000,
      },
    ]);
  });

  it('coerces numeric string fields from MockAPI', () => {
    let result: unknown;

    api.getDeals().subscribe((deals) => {
      result = deals;
    });

    httpMock.expectOne(dealsUrl).flush([
      {
        ...sampleDto,
        purchasePrice: '15000000',
        netOperatingIncome: '1200000',
      },
    ]);

    expect(result).toEqual([
      expect.objectContaining({
        purchasePrice: 15_000_000,
        netOperatingIncome: 1_200_000,
      }),
    ]);
  });

  it('rejects an unexpected GET payload shape', () => {
    let error: unknown;

    api.getDeals().subscribe({
      error: (err: unknown) => {
        error = err;
      },
    });

    httpMock.expectOne(dealsUrl).flush({ not: 'a list' });

    expect(error).toBeInstanceOf(DealApiValidationError);
  });

  it('maps HTTP failures on GET to a request error', () => {
    let error: unknown;

    api.getDeals().subscribe({
      error: (err: unknown) => {
        error = err;
      },
    });

    httpMock.expectOne(dealsUrl).flush('boom', { status: 500, statusText: 'Server Error' });

    expect(error).toBeInstanceOf(DealApiRequestError);
  });

  it('maps transport failures on GET to a request error', () => {
    let error: unknown;

    api.getDeals().subscribe({
      error: (err: unknown) => {
        error = err;
      },
    });

    httpMock.expectOne(dealsUrl).error(new ProgressEvent('error'));

    expect(error).toBeInstanceOf(DealApiRequestError);
  });

  it('POSTs a create body without an id and maps the response', () => {
    let result: unknown;

    api
      .createDeal({
        name: 'Foxglove Distribution Center',
        address: '18 Foxglove Lane, Reno, NV 89506',
        purchasePrice: 5_000_000,
        netOperatingIncome: 325_000,
      })
      .subscribe((deal) => {
        result = deal;
      });

    const request = httpMock.expectOne(dealsUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Foxglove Distribution Center',
      address: '18 Foxglove Lane, Reno, NV 89506',
      purchasePrice: 5_000_000,
      netOperatingIncome: 325_000,
    });
    expect(request.request.body).not.toHaveProperty('id');

    request.flush({ ...sampleDto, id: '99', name: 'Foxglove Distribution Center' });

    expect(result).toEqual(
      expect.objectContaining({
        id: '99',
        name: 'Foxglove Distribution Center',
      }),
    );
  });

  it('rejects an unexpected POST payload shape', () => {
    let error: unknown;

    api
      .createDeal({
        name: 'x',
        address: 'y',
        purchasePrice: 1,
        netOperatingIncome: 0,
      })
      .subscribe({
        error: (err: unknown) => {
          error = err;
        },
      });

    httpMock.expectOne(dealsUrl).flush({ id: '1' });

    expect(error).toBeInstanceOf(DealApiValidationError);
  });

  it('maps HTTP failures on POST to a request error', () => {
    let error: unknown;

    api
      .createDeal({
        name: 'x',
        address: 'y',
        purchasePrice: 1,
        netOperatingIncome: 0,
      })
      .subscribe({
        error: (err: unknown) => {
          error = err;
        },
      });

    httpMock.expectOne(dealsUrl).flush('boom', { status: 500, statusText: 'Server Error' });

    expect(error).toBeInstanceOf(DealApiRequestError);
  });

  it('maps transport failures on POST to a request error', () => {
    let error: unknown;

    api
      .createDeal({
        name: 'x',
        address: 'y',
        purchasePrice: 1,
        netOperatingIncome: 0,
      })
      .subscribe({
        error: (err: unknown) => {
          error = err;
        },
      });

    httpMock.expectOne(dealsUrl).error(new ProgressEvent('error'));

    expect(error).toBeInstanceOf(DealApiRequestError);
  });

  it('maps GET timeouts to a request error', () => {
    jest.useFakeTimers();
    let error: unknown;

    try {
      api.getDeals().subscribe({
        error: (err: unknown) => {
          error = err;
        },
      });

      httpMock.expectOne(dealsUrl);
      jest.advanceTimersByTime(DEAL_API_REQUEST_TIMEOUT_MS + 1);

      expect(error).toBeInstanceOf(DealApiRequestError);
    } finally {
      jest.useRealTimers();
    }
  });
});
