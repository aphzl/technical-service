package org.educ.ts.controller;

import org.educ.ts.model.dto.AuthorisationResponse;
import org.educ.ts.model.dto.AuthorizationRequest;
import org.educ.ts.model.dto.LoginStatus;
import org.educ.ts.service.AuthorizationService;
import org.educ.ts.service.TokenProvider;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RestController
@RequestMapping(value = "/api", produces = APPLICATION_JSON_UTF8_VALUE)
public class AuthorizationController {

    private final AuthorizationService authorizationService;

    public AuthorizationController(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<AuthorisationResponse> login(
            @RequestBody AuthorizationRequest authorizationRequest,
            HttpServletResponse response
    ) {
        AuthorisationResponse authorisationResponse = authorizationService.authenticate(authorizationRequest);
        HttpHeaders httpHeaders = new HttpHeaders();

        if (authorisationResponse.getStatus() != LoginStatus.OK) {
            return new ResponseEntity<>(authorisationResponse, httpHeaders, HttpStatus.OK);
        }

        Cookie jwt = new Cookie(TokenProvider.JWT, authorisationResponse.getJwt());
        jwt.setPath("/");
        response.addCookie(jwt);

        return new ResponseEntity<>(authorisationResponse, httpHeaders, HttpStatus.OK);
    }

}
