import { IsUUID, IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  productId: string;
}