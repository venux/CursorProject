import { Controller, Get, Headers } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("verify")
  verify(@Headers("authorization") authorization?: string) {
    const token = authorization?.replace("Bearer ", "") || "";
    return this.authService.validateToken(token);
  }
}

