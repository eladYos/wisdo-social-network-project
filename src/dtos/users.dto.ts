import { IsEmail, IsOptional, IsString, IsUrl, isArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  @IsOptional()
  public role: string;

  @IsUrl()
  public image: string;

  @IsString()
  public country: string;

  @IsString({ each: true })
  public Communities: string[];
}
