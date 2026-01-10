import { IsEmail, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
