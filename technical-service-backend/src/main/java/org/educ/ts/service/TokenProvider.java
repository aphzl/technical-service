package org.educ.ts.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
public class TokenProvider {

    public static final String JWT = "jwt";

    private static final long DAY_MILLISECONDS = 24 * 60 * 60 * 1000L;
    private static final long TOKEN_VALIDITY_TIME = DAY_MILLISECONDS;

    private static final String USER_ID = "userId";
    private static final String SECRET_KEY = "6a42ce03-0682-437a-be78-1a170c84855a";

    public String parseTokenToLogin(String token) {
        return getLogin(parseToken(token));
    }

    public String createToken(String login) {
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .claim(USER_ID, login)
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY_TIME))
                .compact();
    }

    public boolean validateToken(String token) {
        if (StringUtils.isEmpty(token)) {
            return false;
        }

        try {
            Claims claims = parseToken(token);
            if (claims.containsKey(USER_ID)
                    && StringUtils.isNoneEmpty(getLogin(claims))
                    && claims.getExpiration().getTime() > System.currentTimeMillis()) {
                return true;
            }
        } catch (Exception e) {
            log.error("failed to parse token", e);
        }

        return false;
    }

    private String getLogin(Claims claims) {
        return (String) claims.get(USER_ID);
    }

    private Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
