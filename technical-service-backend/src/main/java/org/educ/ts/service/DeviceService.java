package org.educ.ts.service;

import org.educ.ts.model.dto.DeviceDto;
import org.educ.ts.model.entity.Device;
import org.educ.ts.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final EntityConverter entityConverter;

    public DeviceService(DeviceRepository deviceRepository, EntityConverter entityConverter) {
        this.deviceRepository = deviceRepository;
        this.entityConverter = entityConverter;
    }

    @Transactional
    public DeviceDto get(String id) {
        return deviceRepository.findById(id)
                .map(Device::toDto)
                .orElse(null);
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
}
