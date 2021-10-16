package org.educ.ts.repository;

import org.educ.ts.model.RequestStatus;
import org.educ.ts.model.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, String> {

    List<Request> findByAssignedTo(String executorLogin);

    List<Request> findByStatus(RequestStatus status);

}
