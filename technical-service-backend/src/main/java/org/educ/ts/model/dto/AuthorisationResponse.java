package org.educ.ts.model.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorisationResponse implements Serializable {

    private LoginStatus status;
    private String jwt;
    private UserDto user;

}
