package org.educ.ts.repository;

import org.educ.ts.model.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {

    List<Device> findBySerialNumberIsContaining(String text);

    List<Device> findByNameIsContaining(String text);

}
