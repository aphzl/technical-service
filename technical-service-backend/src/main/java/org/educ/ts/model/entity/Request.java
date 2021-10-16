package org.educ.ts.model.entity;

import lombok.*;
import org.educ.ts.model.RequestStatus;
import org.educ.ts.model.dto.RequestDto;
import org.educ.ts.util.SecurityContextUtils;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "request")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    @Id
    private String id;

    @Column
    @Enumerated(value = EnumType.STRING)
    private RequestStatus status;

    @Column(name = "contact_info")
    private String contactInfo;

    @Column(name = "problem_description")
    private String problemDescription;

    @Column(name = "resolve_description")
    private String resolveDescription;

    @Column(name = "created_timestamp")
    private Timestamp createdAt;

    @Column(name = "updated_timestamp")
    private Timestamp updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "assigned_to")
    private String assignedTo;

    @ManyToOne
    @JoinColumns(value = @JoinColumn(name = "device_id", referencedColumnName = "id"))
    private Device device;

    @PrePersist
    public void onPrePersist() {
        createdBy = SecurityContextUtils.getUserLogin();
        createdAt = new Timestamp(System.currentTimeMillis());
        updatedBy = createdBy;
        updatedAt = createdAt;
    }

    @PreUpdate
    public void onPreUpdate() {
        updatedBy = SecurityContextUtils.getUserLogin();
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

    public RequestDto toDto() {
        return RequestDto.builder()
                .id(id)
                .status(status)
                .contactInfo(contactInfo)
                .problemDescription(problemDescription)
                .resolveDescription(resolveDescription)
                .createdAt(createdAt.getTime())
                .updatedAt(updatedAt.getTime())
                .createdBy(createdBy)
                .updatedBy(updatedBy)
                .assignedTo(assignedTo)
                .build();
    }
}
