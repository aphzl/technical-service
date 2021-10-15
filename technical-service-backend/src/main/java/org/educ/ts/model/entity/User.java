package org.educ.ts.model.entity;

import lombok.*;
import org.educ.ts.model.UserRole;
import org.educ.ts.model.dto.UserDto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "login", unique = true, nullable = false)
    private String login;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Column
    private UserRole role;

    public UserDto toDto() {
        return UserDto.builder()
                .login(login)
                .firstName(firstName)
                .lastName(lastName)
                .middleName(middleName)
                .role(role)
                .build();
    }
}
