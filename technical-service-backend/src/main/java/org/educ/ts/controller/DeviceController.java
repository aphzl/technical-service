package org.educ.ts.controller;

import org.educ.ts.model.UserRole;
import org.educ.ts.model.dto.DeviceDto;
import org.educ.ts.security.RoleRequired;
import org.educ.ts.service.DeviceService;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RestController
@RequestMapping(value = "/api/device", produces = APPLICATION_JSON_UTF8_VALUE)
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping("/{id}")
    public DeviceDto get(@PathVariable("id") String id) {
        return deviceService.get(id);
    }

    @RoleRequired(needOne = { UserRole.MANAGER, UserRole.ADMIN })
    @PostMapping
    public DeviceDto save(@RequestBody DeviceDto deviceDto) {
        return deviceService.save(deviceDto);
    }

    @RoleRequired(needOne = { UserRole.MANAGER, UserRole.ADMIN })
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        deviceService.delete(id);
    }
}
