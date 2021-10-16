package org.educ.ts.controller;

import org.educ.ts.model.UserRole;
import org.educ.ts.model.dto.DeviceDto;
import org.educ.ts.security.RoleRequired;
import org.educ.ts.service.DeviceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RestController
@RequestMapping(value = "/api/device", produces = APPLICATION_JSON_UTF8_VALUE)
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping("/all")
    public List<DeviceDto> getAll() {
        return deviceService.getAll();
    }

    @GetMapping("/serial/{serial}")
    public List<DeviceDto> findBySerial(@PathVariable("serial") String serial) {
        return deviceService.findBySerial(serial);
    }

    @GetMapping("/name/{name}")
    public List<DeviceDto> findByName(@PathVariable("name") String name) {
        return deviceService.findByName(name);
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
