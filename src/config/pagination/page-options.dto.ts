import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min, IsString } from 'class-validator';

export enum Order {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum SearchType {
    NICKNAME = 'nickname',
    SESSION_ID = 'session_id',
    QUESTION = 'question',
    EMPTY = '',
}

export class PageOptionsDto {

    @ApiPropertyOptional({ default: 'hid' })
    @IsOptional()
    readonly isOrder?: string;

    @ApiPropertyOptional({ default: 'hid' })
    @IsOptional()
    readonly orderName?: string;

    @ApiPropertyOptional({ default: false })
    @Type(() => Boolean)
    @IsOptional()
    readonly isAll?: boolean;

    @ApiPropertyOptional({ default: null })
    @IsOptional()
    readonly is_clear?: boolean;

    @ApiPropertyOptional({ default: null })
    @IsOptional()
    readonly is_active?: string;

    @ApiPropertyOptional({ enum: SearchType, default: SearchType.EMPTY })
    @IsEnum(SearchType)
    @IsOptional()
    readonly searchType?: SearchType = SearchType.EMPTY;

    @ApiPropertyOptional({ default: null })
    @IsOptional()
    @IsString()
    readonly keyword?: string;

    @ApiPropertyOptional({ enum: Order, default: Order.ASC })
    @IsEnum(Order)
    @IsOptional()
    readonly order?: Order = Order.ASC;

    @ApiPropertyOptional({
        minimum: 1,
        default: 1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 100,
        default: 10,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    readonly take?: number = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}


