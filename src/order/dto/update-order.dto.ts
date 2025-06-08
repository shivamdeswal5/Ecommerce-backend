import { IsOptional, IsUUID, ValidateNested, IsArray, IsNumber, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
export class UpdateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];
}

export class OrderItemInput {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity:number;
}