package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer>, UserRepositoryCustom {

    User getByUsername(String username);
    User getByUsernameAndCompanyId(String username, Integer companyId);
    User getByToken(String token);
    Integer countAllByCompanyIdAndEmail(Integer companyId, String email);
}
