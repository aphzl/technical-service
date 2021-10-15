package org.educ.ts.model.dto;

import lombok.*;
import org.educ.ts.model.UserRole;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto implements Serializable {

    private String login;
    private String password;
    private String firstName;
    private String middleName;
    private String lastName;
    private UserRole role;

}
