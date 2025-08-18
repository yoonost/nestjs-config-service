import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Authorization = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>()
    return request.headers['authorization']?.replace('Bearer ', '') ?? ''
})
