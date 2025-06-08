import { IsInt, IsOptional, IsString, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsUUID()
  productId: string;
}