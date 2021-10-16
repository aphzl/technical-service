package org.educ.ts.service;

import org.educ.ts.model.RequestStatus;
import org.educ.ts.model.dto.RequestDto;
import org.educ.ts.model.entity.Request;
import org.educ.ts.repository.RequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final EntityConverter entityConverter;

    public RequestService(RequestRepository requestRepository, EntityConverter entityConverter) {
        this.requestRepository = requestRepository;
        this.entityConverter = entityConverter;
    }

    @Transactional
    public RequestDto get(String id) {
        return requestRepository
                .findById(id)
                .map(Request::toDto)
                .orElse(null);
    }

    @Transactional
    public RequestDto save(RequestDto requestDto) {
        return requestRepository
                .save(entityConverter.toEntity(requestDto))
                .toDto();
    }

    @Transactional
    public void delete(String id) {
        requestRepository.deleteById(id);
    }

    @Transactional
    public List<RequestDto> getAll() {
        return requestRepository
                .findAll().stream()
                .map(Request::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<RequestDto> findByExecutor(String executorLogin) {
        return requestRepository
                .findByAssignedTo(executorLogin).stream()
                .map(Request::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<RequestDto> findByStatus(RequestStatus status) {
        return requestRepository
                .findByStatus(status).stream()
                .map(Request::toDto)
                .collect(Collectors.toList());
    }
}
