package org.educ.ts.service;

import org.educ.ts.model.dto.AuthorisationResponse;
import org.educ.ts.model.dto.AuthorizationRequest;
import org.educ.ts.model.dto.LoginStatus;
import org.educ.ts.model.entity.User;
import org.educ.ts.util.SecurityContextUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    private final UserService userService;
    private final TokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthorizationService(
            UserService userService,
            TokenProvider tokenProvider,
            PasswordEncoder passwordEncoder
    ) {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthorisationResponse authenticate(AuthorizationRequest request) {
        if (request == null || request.getLogin() == null || request.getPassword() == null) {
            return getFailResponse();
        }

        User user = userService.get(request.getLogin());

        if (user != null && passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            SecurityContextUtils.setContext(user.toDto());

            return AuthorisationResponse.builder()
                    .status(LoginStatus.OK)
                    .jwt(tokenProvider.createToken(user.getLogin()))
                    .user(user.toDto())
                    .build();
        }

        return getFailResponse();
    }

    public boolean authenticate(String jwt) {
        SecurityContextUtils.clearContext();
        if (!tokenProvider.validateToken(jwt)) {
            return false;
        }

        String login = tokenProvider.parseTokenToLogin(jwt);
        User user = userService.get(login);

        if (user != null) {
            SecurityContextUtils.setContext(user.toDto());
            return true;
        }

        return false;
    }

    private AuthorisationResponse getFailResponse() {
        return AuthorisationResponse.builder()
                .status(LoginStatus.USER_OR_PASSWORD_NOT_FOUND)
                .build();
    }
}
