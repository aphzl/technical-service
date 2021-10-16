package org.educ.ts.controller;

import org.educ.ts.model.UserRole;
import org.educ.ts.model.dto.UserDto;
import org.educ.ts.security.RoleRequired;
import org.educ.ts.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RestController
@RequestMapping(value = "/api/user", produces = APPLICATION_JSON_UTF8_VALUE)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RoleRequired(needOne = { UserRole.ADMIN, UserRole.MANAGER })
    @GetMapping("/all")
    public List<UserDto> getAll() {
        return userService.getAll();
    }

    @RoleRequired(needOne = { UserRole.ADMIN, UserRole.MANAGER })
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
    @DeleteMapping("/{login}")
    public void delete(@PathVariable("login") String login) {
        userService.delete(login);
    }
}
