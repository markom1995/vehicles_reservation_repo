package ba.telegroup.vehicles_reservation.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.vehicles_reservation.model.modelCustom.CompanyUser;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.CompanyRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class CompanyRepositoryImpl implements CompanyRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT c.id, c.name, c.logo, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.deleted=0 AND u.deleted=0 AND (u.active=1 OR (u.active=0 AND u.token IS NOT NULL AND NOW() < ADDTIME(u.token_time, '00:10:00'))) AND u.role_id=2";
    private static final String SQL_GET_ALL_EXTENDED_BY_ID = "SELECT c.id, c.name, c.time_from, c.time_to,c.company_logo, u.email FROM company c JOIN user u ON c.id=u.company_id WHERE c.id=? AND c.deleted=0 AND u.deleted=0 AND u.active=1 AND u.role_id=2";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<CompanyUser> getAllExtended() {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "CompanyUserMapping").getResultList();
    }

    @Override
    public CompanyUser getAllExtendedById(Integer userId) {
        List<CompanyUser> companyUser = entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_ID, "CompanyUserMapping").setParameter(1, userId).getResultList();
        if(companyUser == null || companyUser.isEmpty()){
            return null;
        }
        else{
            return companyUser.get(0);
        }
    }
}
