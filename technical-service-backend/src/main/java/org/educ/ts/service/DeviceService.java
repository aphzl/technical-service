package org.educ.ts.service;

import org.educ.ts.model.dto.DeviceDto;
import org.educ.ts.model.entity.Device;
import org.educ.ts.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final EntityConverter entityConverter;

    public DeviceService(DeviceRepository deviceRepository, EntityConverter entityConverter) {
        this.deviceRepository = deviceRepository;
        this.entityConverter = entityConverter;
    }

    @Transactional
    public List<DeviceDto> findBySerial(String serial) {
        return deviceRepository.findBySerialNumberIsContaining(serial).stream()
                .map(Device::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<DeviceDto> findByName(String name) {
        return deviceRepository.findByNameIsContaining(name).stream()
                .map(Device::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeviceDto save(DeviceDto deviceDto) {
        return deviceRepository
                .save(entityConverter.toEntity(deviceDto))
                .toDto();
    }

    @Transactional
    public void delete(String id) {
        deviceRepository.deleteById(id);
    }

    @Transactional
    public List<DeviceDto> getAll() {
        return deviceRepository.findAll().stream()
                .map(Device::toDto)
                .collect(Collectors.toList());
    }
}
