package org.educ.ts.security;

import org.educ.ts.model.UserRole;

public @interface RoleRequired {

    UserRole[] needOne();

}
