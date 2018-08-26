package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyIdAndDeletableRepository;
import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer>, UserRepositoryCustom, HasCompanyIdAndDeletableRepository<User> {

    User getByUsername(String username);
    User getByUsernameAndCompanyId(String username, Integer companyId);
    User getByCompanyIdAndRoleIdAndActiveAndDeleted(Integer companyId, Integer roleId, byte active, byte deleted);
    User getByToken(String token);
    List<User> getByCompanyIdAndDeletedAndActiveAndMailStatusId(Integer companyId, Byte deleted, Byte active, Integer statusId);
    List<User> getByCompanyIdAndDeletedAndActiveAndMailStatusIdAndLocationId(Integer companyId, Byte deleted, Byte active, Integer statusId, Integer locationId);
    Integer countAllByCompanyIdAndEmail(Integer companyId, String email);
}
