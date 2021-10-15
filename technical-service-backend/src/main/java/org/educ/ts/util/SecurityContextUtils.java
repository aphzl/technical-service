package org.educ.ts.util;

import org.educ.ts.model.dto.UserDto;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.Optional;

public class SecurityContextUtils {

    public static String UNKNOWN_USER = "unknown";

    public static void setContext(UserDto userDto) {
        Authentication auth = new UsernamePasswordAuthenticationToken(userDto, null, new ArrayList<>());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    public static void clearContext() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    public static UserDto getUser() {
        if (SecurityContextHolder.getContext() == null || SecurityContextHolder.getContext().getAuthentication() == null) {
            return null;
        }

        return (UserDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static String getUserLogin() {
        return Optional.ofNullable(getUser()).map(UserDto::getLogin).orElse(UNKNOWN_USER);
    }

}
