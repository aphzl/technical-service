package org.educ.ts.controller;

import org.educ.ts.model.UserRole;
import org.educ.ts.model.dto.RequestDto;
import org.educ.ts.security.RoleRequired;
import org.educ.ts.service.RequestService;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RestController
@RequestMapping(value = "/api/request", produces = APPLICATION_JSON_UTF8_VALUE)
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping("/{id}")
    public RequestDto get(@PathVariable("id") String id) {
        return requestService.get(id);
    }

    @PostMapping
    public RequestDto save(@RequestBody RequestDto requestDto) {
        return requestService.save(requestDto);
    }

    @RoleRequired(needOne = { UserRole.MANAGER, UserRole.ADMIN })
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        requestService.delete(id);
    }
}
