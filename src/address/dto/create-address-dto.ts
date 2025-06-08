
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsPhoneNumber,
  Length,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsPhoneNumber('IN') 
  phone: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @Matches(/^\d{5,10}$/, { message: 'Postal code must be 5-10 digits' })
  postalCode: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}