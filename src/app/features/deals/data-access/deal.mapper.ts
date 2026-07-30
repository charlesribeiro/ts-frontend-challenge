import { CreateDealInput } from '../models/create-deal-input.model';
import { Deal } from '../models/deal.model';
import { DealDto } from './deal.schema';

/** Maps a validated API DTO onto the domain `Deal`. */
export function mapDealDtoToDeal(dto: DealDto): Deal {
  return {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    purchasePrice: dto.purchasePrice,
    netOperatingIncome: dto.netOperatingIncome,
  };
}

/** Maps a create request into the JSON body MockAPI expects (no `id`). */
export function mapCreateDealInputToBody(input: CreateDealInput): Omit<DealDto, 'id'> {
  return {
    name: input.name,
    address: input.address,
    purchasePrice: input.purchasePrice,
    netOperatingIncome: input.netOperatingIncome,
  };
}
