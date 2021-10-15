package org.educ.ts.service;

import org.educ.ts.model.dto.DeviceDto;
import org.educ.ts.model.dto.RequestDto;
import org.educ.ts.model.dto.UserDto;
import org.educ.ts.model.entity.Device;
import org.educ.ts.model.entity.Request;
import org.educ.ts.model.entity.User;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;

@Component
public class EntityConverter {

    public Device toEntity(DeviceDto dto) {
        if (dto == null) {
            return null;
        }

        List<Request> requests = ofNullable(dto.getRequests())
                .map(r -> r.stream().map(this::toEntity).collect(Collectors.toList()))
                .orElse(null);

        return Device.builder()
                .id(dto.getId())
                .name(dto.getName())
                .serialNumber(dto.getSerialNumber())
                .description(dto.getDescription())
                .requests(requests)
                .build();
    }

    public User toEntity(UserDto dto) {
        if (dto == null) {
            return null;
        }

        return User.builder()
                .login(dto.getLogin())
                .passwordHash(dto.getPassword())
                .firstName(dto.getFirstName())
                .middleName(dto.getMiddleName())
                .lastName(dto.getLastName())
                .role(dto.getRole())
                .build();
    }

    public Request toEntity(RequestDto dto) {
        if (dto == null) {
            return null;
        }

        return Request.builder()
                .id(dto.getId())
                .status(dto.getStatus())
                .contactInfo(dto.getContactInfo())
                .problemDescription(dto.getProblemDescription())
                .resolveDescription(dto.getResolveDescription())
                .createdAt(ofNullable(dto.getCreatedAt()).map(Timestamp::new).orElse(null))
                .updatedAt(ofNullable(dto.getUpdatedAt()).map(Timestamp::new).orElse(null))
                .createdBy(dto.getCreatedBy())
                .updatedBy(dto.getUpdatedBy())
                .device(toEntity(dto.getDevice()))
                .build();
    }
}
