package org.educ.ts.model.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDto implements Serializable {

    private String id;
    private String name;
    private String serialNumber;
    private String description;
    private List<RequestDto> requests;

}
