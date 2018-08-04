package ba.telegroup.vehicles_reservation.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.UserRepositoryCustom;
import ba.telegroup.vehicles_reservation.util.UserInformation;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class UserRepositoryImpl implements UserRepositoryCustom {

    private static final String SQL_LOGIN = "SELECT DISTINCT u.id, u.email, u.username, u.password, u.first_name, u.last_name, u.photo, u.active, u.token, u.token_time, u.company_id, u.role_id FROM user u JOIN company c ON IF(u.role_id=1, true, u.company_id=c.id) WHERE u.username=? AND u.password=SHA2(?, 512) AND IF(u.role_id=1, u.company_id IS NULL, c.name=?)";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public User login(UserInformation userInformation) {
        List<User> user = entityManager.createNativeQuery(SQL_LOGIN, "UserMapping").setParameter(1, userInformation.getUsername()).setParameter(2, userInformation.getPassword()).setParameter(3, userInformation.getCompanyName()).getResultList();
        if(user == null || user.isEmpty()){
            return null;
        }
        else{
            return user.get(0);
        }
    }
}
