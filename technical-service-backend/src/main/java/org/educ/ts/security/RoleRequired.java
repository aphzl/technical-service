package org.educ.ts.security;

import org.educ.ts.model.UserRole;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface RoleRequired {

    UserRole[] needOne();

}
