import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../../modules/auth/auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("未提供认证令牌");
    }
    try {
      const user = await this.authService.validateToken(token);
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException("无效的认证令牌");
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}

