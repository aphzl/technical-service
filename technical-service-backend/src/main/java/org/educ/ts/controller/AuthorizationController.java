package org.educ.ts.controller;

import org.educ.ts.model.dto.AuthorisationResponse;
import org.educ.ts.model.dto.AuthorizationRequest;
import org.educ.ts.service.AuthorizationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RestController
@RequestMapping(value = "/api", produces = APPLICATION_JSON_UTF8_VALUE)
public class AuthorizationController {

    private final AuthorizationService authorizationService;

    public AuthorizationController(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @PostMapping(value = "/login")
    public AuthorisationResponse login(@RequestBody AuthorizationRequest authorizationRequest) {
        return authorizationService.authenticate(authorizationRequest);
    }

}
