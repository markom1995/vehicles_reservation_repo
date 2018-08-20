package ba.telegroup.vehicles_reservation.repository.repositoryCustom;

import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.model.modelCustom.UserRole;
import ba.telegroup.vehicles_reservation.util.UserInformation;

import java.util.List;

public interface UserRepositoryCustom {

    User login(UserInformation userInformation);
    List<UserRole> getByCompanyIdAndDeletedAndActive(Integer companyId, byte deleted, byte active);
}
