import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;

}