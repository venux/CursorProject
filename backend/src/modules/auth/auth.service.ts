import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  // TODO: 接入 Keycloak 适配，校验与角色映射
  validateToken(token: string) {
    return { valid: !!token };
  }
}

