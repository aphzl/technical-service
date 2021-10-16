package org.educ.ts.service;

import org.educ.ts.model.dto.DeviceDto;
import org.educ.ts.model.dto.RequestDto;
import org.educ.ts.model.dto.UserDto;
import org.educ.ts.model.entity.Device;
import org.educ.ts.model.entity.Request;
import org.educ.ts.model.entity.User;
import org.educ.ts.repository.DeviceRepository;
import org.educ.ts.repository.RequestRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;

@Component
public class EntityConverter {

    private final DeviceRepository deviceRepository;
    private final RequestRepository requestRepository;

    public EntityConverter(DeviceRepository deviceRepository, RequestRepository requestRepository) {
        this.deviceRepository = deviceRepository;
        this.requestRepository = requestRepository;
    }

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

        Device device = deviceRepository.findBySerialNumber(dto.getDeviceSerialNumber());
        Optional<Request> existingRequest = requestRepository.findById(dto.getId());

        return Request.builder()
                .id(dto.getId())
                .status(dto.getStatus())
                .contactInfo(dto.getContactInfo())
                .problemDescription(dto.getProblemDescription())
                .resolveDescription(dto.getResolveDescription())
                .createdAt(existingRequest.map(Request::getCreatedAt).orElse(null))
                .updatedAt(existingRequest.map(Request::getUpdatedAt).orElse(null))
                .createdBy(existingRequest.map(Request::getCreatedBy).orElse(null))
                .updatedBy(existingRequest.map(Request::getUpdatedBy).orElse(null))
                .device(device)
                .assignedTo(dto.getAssignedTo())
                .build();
    }
}
