import { Deal } from '../models/deal.model';
import { DealDto } from './deal.schema';

/** Maps a domain deal onto the MockAPI DTO field shape used in HTTP fixtures. */
export function toDealDto(deal: Deal): DealDto {
  return {
    id: deal.id,
    name: deal.name,
    address: deal.address,
    purchasePrice: deal.purchasePrice,
    netOperatingIncome: deal.netOperatingIncome,
  };
}
