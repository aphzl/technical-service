package org.educ.ts.model.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorizationRequest implements Serializable {

    String login;
    String password;

}
