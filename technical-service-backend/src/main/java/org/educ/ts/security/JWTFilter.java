package org.educ.ts.security;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ArrayUtils;
import org.educ.ts.service.AuthorizationService;
import org.educ.ts.service.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class JWTFilter extends GenericFilterBean {

    private final AuthorizationService authorizationService;

    public JWTFilter(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        String jwt = resolveToken((HttpServletRequest) servletRequest);

        if (authorizationService.authenticate(jwt)) {
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            HttpServletRequest request = (HttpServletRequest) servletRequest;
            log.error("Access Denied ip: {} url: {}", request.getRemoteAddr(), request.getRequestURI());

            ((HttpServletResponse) servletResponse).setHeader("Content-Type", "application/json");
            ((HttpServletResponse) servletResponse).setStatus(401);
        }
    }

    private String resolveToken(HttpServletRequest request){
        String jwt = null;
        Cookie[] cookies = request.getCookies();
        if (ArrayUtils.isNotEmpty(cookies)) {
            for (Cookie cookie : cookies) {
                if (TokenProvider.JWT.equals(cookie.getName())) {
                    jwt =  cookie.getValue();
                }
            }
        }
        return jwt;
    }
}
