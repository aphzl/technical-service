package org.educ.ts.repository;

import org.educ.ts.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    User getByLoginIgnoreCase(String login);

}
