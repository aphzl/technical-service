package org.educ.ts.model.dto;

import lombok.*;
import org.educ.ts.model.RequestStatus;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestDto implements Serializable {

    private String id;
    private RequestStatus status;
    private String contactInfo;
    private String problemDescription;
    private String resolveDescription;
    private Long createdAt;
    private Long updatedAt;
    private String createdBy;
    private String updatedBy;
    private DeviceDto device;
    private String assignedTo;

}
