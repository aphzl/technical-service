package org.educ.ts.controller.advice;

import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.educ.ts.model.UserRole;
import org.educ.ts.model.dto.UserDto;
import org.educ.ts.security.RoleRequired;
import org.educ.ts.util.SecurityContextUtils;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.Arrays;

@Aspect
@Service
public class RoleRequiredAdvice {

    @Around("@annotation(org.educ.ts.security.RoleRequired)")
    public Object checkRole(ProceedingJoinPoint pointcut) throws Throwable {
        UserDto user = SecurityContextUtils.getUser();
        if (user == null) {
            throw new AccessDeniedException("user not authorised");
        }

        MethodSignature signature = (MethodSignature) pointcut.getSignature();
        Method method = signature.getMethod();
        UserRole[] roles = method.getAnnotation(RoleRequired.class).needOne();

        boolean accessed = roles.length == 0 || Arrays.stream(roles).anyMatch(r -> r == user.getRole());

        if (accessed) {
            return pointcut.proceed();
        } else {
            throw new AccessDeniedException("User " + user.getLogin() + " do not have rights " + StringUtils.join(roles, ", "));
        }
    }
}
