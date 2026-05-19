import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { Type } from 'class-transformer';



export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @Min(0)
    @IsNumber()
    @Type(() => Number)
    offset?:number;
}
