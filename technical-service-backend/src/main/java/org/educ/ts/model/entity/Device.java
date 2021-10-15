package org.educ.ts.model.entity;

import lombok.*;
import org.educ.ts.model.dto.DeviceDto;
import org.educ.ts.model.dto.RequestDto;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "device")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Device {

    @Id
    private String id;

    @Column
    private String name;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column
    private String description;

    @OneToMany(mappedBy = "device")
    private List<Request> requests;

    public DeviceDto toDto() {
        List<RequestDto> requestsDto = requests == null
                ? new ArrayList<>()
                : requests.stream()
                        .map(Request::toDto)
                        .collect(Collectors.toList());

        return DeviceDto.builder()
                .id(id)
                .name(name)
                .serialNumber(serialNumber)
                .description(description)
                .requests(requestsDto)
                .build();
    }
}
