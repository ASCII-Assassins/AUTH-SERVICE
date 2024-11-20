import { Expose } from 'class-transformer';

export class UserDto {
    @Expose()
    readonly email: string;
    
    @Expose()
    readonly firstName: string;
    
    @Expose()
    readonly lastName: string;
    
    @Expose()
    readonly username: string;
}