package org.educ.ts.controller;

import org.educ.ts.model.UserRole;
import org.educ.ts.model.dto.UserDto;
import org.educ.ts.security.RoleRequired;
import org.educ.ts.service.UserService;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RestController
@RequestMapping(value = "/api/user", produces = APPLICATION_JSON_UTF8_VALUE)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RoleRequired(needOne = UserRole.ADMIN)
    @GetMapping("/{login}")
    public UserDto get(@PathVariable("login") String id) {
        return userService.getDto(id);
    }

    @RoleRequired(needOne = UserRole.ADMIN)
    @PostMapping
    public UserDto save(@RequestBody UserDto user) {
        return userService.save(user);
    }

    @RoleRequired(needOne = UserRole.ADMIN)
    @DeleteMapping
    public void delete(@PathVariable("id") String id) {
        userService.delete(id);
    }
}
