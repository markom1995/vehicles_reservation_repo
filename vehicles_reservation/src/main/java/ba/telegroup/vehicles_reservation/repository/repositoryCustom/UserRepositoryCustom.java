package ba.telegroup.vehicles_reservation.repository.repositoryCustom;

import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.util.UserInformation;

public interface UserRepositoryCustom {

    User login(UserInformation userInformation);
}
