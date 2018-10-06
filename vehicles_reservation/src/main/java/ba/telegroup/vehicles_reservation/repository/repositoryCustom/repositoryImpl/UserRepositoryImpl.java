package ba.telegroup.vehicles_reservation.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.model.modelCustom.UserLocation;
import ba.telegroup.vehicles_reservation.model.modelCustom.UserRole;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.UserRepositoryCustom;
import ba.telegroup.vehicles_reservation.util.UserInformation;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class UserRepositoryImpl implements UserRepositoryCustom {

    private static final String SQL_LOGIN = "SELECT DISTINCT u.id, u.email, u.username, u.password, u.first_name, u.last_name, u.photo, u.active, u.deleted, u.request, u.token, u.token_time, u.mail_status_id, u.location_id, u.company_id, u.role_id FROM user u JOIN company c ON IF(u.role_id=1, true, u.company_id=c.id) WHERE u.active=1 AND u.deleted=0 AND u.username=? AND u.password=SHA2(?, 512) AND IF(u.role_id=1, u.company_id IS NULL, c.name=?)";
    private static final String SQL_GET_BY_COMPANY_ID_AND_DELETED_AND_ACTIVE = "SELECT u.id, u.username, u.first_name, u.last_name, r.name as role_name FROM user u JOIN role r ON u.role_id=r.id WHERE u.company_id=? AND u.deleted=? AND u.active=?";
    private static final String SQL_GET_ALL_EXTENDED_BY_COMPANY_ID_AND_DELETED_AND_ACTIVE = "SELECT u.id, u.first_name, u.last_name, u.email, u.username, CONCAT(l.name, ' - ', l.address) as location FROM user u JOIN location l ON u.location_id=l.id WHERE u.company_id=? AND u.deleted=? AND u.active=? AND u.role_id=3";

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

    @Override
    public List<UserRole> getByCompanyIdAndDeletedAndActive(Integer companyId, byte deleted, byte active) {
        return entityManager.createNativeQuery(SQL_GET_BY_COMPANY_ID_AND_DELETED_AND_ACTIVE, "UserRoleMapping").setParameter(1, companyId).setParameter(2, deleted).setParameter(1, companyId).setParameter(3, active).getResultList();
    }

    @Override
    public List<UserLocation> getAllExtendedUserLocationByCompanyIdAndDeletedAndActive(Integer companyId, byte deleted, byte active) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_COMPANY_ID_AND_DELETED_AND_ACTIVE, "UserLocationMapping").setParameter(1, companyId).setParameter(2, deleted).setParameter(3, active).getResultList();
    }
}
