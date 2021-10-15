package org.educ.ts.service;

import org.educ.ts.model.dto.UserDto;
import org.educ.ts.model.entity.User;
import org.educ.ts.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EntityConverter entityConverter;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            EntityConverter entityConverter,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.entityConverter = entityConverter;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserDto getDto(String login) {
        return get(login).toDto();
    }

    @Transactional
    public UserDto save(UserDto userDto) {
        String login = userDto.getLogin().toLowerCase();
        User existingUser = userRepository
                .findById(login)
                .orElse(null);

        String password = userDto.getPassword();

        if (password != null) {
            if (password.length() < 1) {
                throw new IllegalArgumentException("Password should not empty");
            }
            userDto.setPassword(passwordEncoder.encode(password));
        } else if (existingUser != null) {
            userDto.setPassword(existingUser.getPasswordHash());
        }

        return userRepository
                .save(entityConverter.toEntity(userDto))
                .toDto();
    }

    @Transactional
    public void delete(String id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public User get(String login) {
        return userRepository.getByLoginIgnoreCase(login.toLowerCase());
    }
}
