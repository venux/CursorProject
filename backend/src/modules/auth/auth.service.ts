import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument, UserRole } from "../../common/schemas/user.schema";
import axios from "axios";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private keycloakIssuer: string;
  private keycloakClientId: string;
  private keycloakClientSecret: string;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService
  ) {
    const keycloakConfig = this.configService.get("keycloak");
    this.keycloakIssuer = keycloakConfig?.issuer || "http://localhost:8080/realms/customer-support";
    this.keycloakClientId = keycloakConfig?.clientId || "cs-frontend";
    this.keycloakClientSecret = keycloakConfig?.clientSecret || "change-me";
  }

  async validateToken(token: string): Promise<any> {
    try {
      // 简化版：实际应该调用 Keycloak 的 JWKS 端点验证 JWT
      // 这里先实现基础验证，后续可接入完整的 Keycloak 适配器
      if (!token) {
        throw new UnauthorizedException("Token 不能为空");
      }

      // 尝试从 Keycloak 验证 token（如果配置了）
      if (this.keycloakIssuer && this.keycloakIssuer !== "http://localhost:8080/realms/customer-support") {
        try {
          const response = await axios.get(`${this.keycloakIssuer}/protocol/openid-connect/userinfo`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userInfo = response.data;
          return await this.getOrCreateUser(userInfo);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.warn("Keycloak 验证失败，使用本地验证", errorMessage);
        }
      }

      // 开发环境：简化验证（仅用于开发测试）
      // 生产环境必须使用 Keycloak
      if (this.configService.get("env") === "development") {
        // 解析 token（简化版，实际应使用 JWT 库）
        const decoded = this.decodeToken(token);
        if (decoded) {
          return await this.getOrCreateUser(decoded);
        }
      }

      throw new UnauthorizedException("无效的 Token");
    } catch (error) {
      this.logger.error("Token 验证失败", error);
      throw new UnauthorizedException("Token 验证失败");
    }
  }

  private decodeToken(token: string): any {
    try {
      // 简化版 token 解码（仅用于开发）
      // 实际应使用 jsonwebtoken 或 jose 库
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
        return {
          sub: payload.sub || payload.id,
          email: payload.email,
          name: payload.name || payload.username,
          preferred_username: payload.preferred_username || payload.username,
          roles: payload.realm_access?.roles || payload.roles || []
        };
      }
      // 如果不是标准 JWT，尝试作为简单 token 处理
      return {
        sub: token,
        email: `${token}@example.com`,
        name: token,
        preferred_username: token,
        roles: []
      };
    } catch {
      return null;
    }
  }

  private async getOrCreateUser(keycloakUser: any): Promise<any> {
    const keycloakId = keycloakUser.sub;
    let user = await this.userModel.findOne({ keycloakId });

    if (!user) {
      // 根据 Keycloak 角色映射到系统角色
      const roles = keycloakUser.roles || [];
      let role = UserRole.USER;
      if (roles.includes("admin") || roles.includes("Admin")) {
        role = UserRole.ADMIN;
      } else if (roles.includes("agent") || roles.includes("Agent")) {
        role = UserRole.AGENT;
      }

      user = await this.userModel.create({
        keycloakId,
        username: keycloakUser.preferred_username || keycloakUser.name,
        email: keycloakUser.email || `${keycloakId}@example.com`,
        displayName: keycloakUser.name || keycloakUser.preferred_username,
        role,
        permissions: [],
        preferences: {},
        active: true,
        lastLoginAt: new Date()
      });
    } else {
      user.lastLoginAt = new Date();
      await user.save();
    }

    return {
      id: user._id.toString(),
      keycloakId: user.keycloakId,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      permissions: user.permissions
    };
  }

  async getUserById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }

  async getUserByKeycloakId(keycloakId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ keycloakId });
  }
}

