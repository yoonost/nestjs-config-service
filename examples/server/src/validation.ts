import { IsObject, IsString, IsNumber, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class PostgresValidation {
    @IsString()
    private readonly host?: string

    @IsNumber()
    private readonly port?: number

    @IsString()
    private readonly user?: string

    @IsString()
    private readonly password?: string

    @IsString()
    private readonly database?: string
}

export class RedisValidation {
    @IsString()
    private readonly host?: string

    @IsNumber()
    private readonly port?: number

    @IsString()
    private readonly password?: string
}

export class RabbitmqValidation {
    @IsString()
    private readonly host?: string

    @IsNumber()
    private readonly port?: number

    @IsString()
    private readonly user?: string

    @IsString()
    private readonly password?: string
}

export class KafkaValidation {
    @IsString()
    private readonly host?: string

    @IsNumber()
    private readonly port?: number

    @IsString()
    private readonly user?: string

    @IsString()
    private readonly password?: string
}

export class ValidationService {
    @IsObject()
    @ValidateNested()
    @Type(() => PostgresValidation)
    private readonly postgres?: PostgresValidation

    @IsObject()
    @ValidateNested()
    @Type(() => RedisValidation)
    private readonly redis?: RedisValidation

    @IsObject()
    @ValidateNested()
    @Type(() => RabbitmqValidation)
    private readonly rabbitmq?: RabbitmqValidation

    @IsObject()
    @ValidateNested()
    @Type(() => KafkaValidation)
    private readonly kafka?: KafkaValidation
}