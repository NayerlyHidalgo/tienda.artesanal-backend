import { IsOptional, IsInt, Min, IsString, IsEmail } from 'class-validator';

export class UpdateOrdenDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;
}
