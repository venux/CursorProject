import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    verify(authorization?: string): {
        valid: boolean;
    };
}
