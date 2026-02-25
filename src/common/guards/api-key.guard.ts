
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('--- ApiKeyGuard triggered ---');
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      console.log('ApiKeyGuard: Authorization header is missing.');
      throw new UnauthorizedException('API key is missing');
    }

    const [bearer, apiKey] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !apiKey) {
      console.log('ApiKeyGuard: Invalid API key format.');
      throw new UnauthorizedException('Invalid API key format');
    }
    
    const isValid = apiKey === process.env.API_KEY;

    if (!isValid) {
      console.log('ApiKeyGuard: Invalid API key.');
      throw new UnauthorizedException('Invalid API key');
    }

    console.log('ApiKeyGuard: API key is valid. Request allowed.');
    return true;
  }
}
