package ba.telegroup.vehicles_reservation.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.vehicles_reservation.model.modelCustom.LoggerUserRoleCompany;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.LoggerRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class LoggerRepositoryImpl implements LoggerRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT l.id, l.action_type, l.action_details, l.table_name, l.created, l.user_id, l.atomic, l.company_id, u.username, r.name as role_name, c.name as company_name FROM logger l JOIN user u ON l.user_id=u.id JOIN role r ON u.role_id=r.id LEFT JOIN company c ON l.company_id=c.id ORDER BY l.created DESC";
    private static final String SQL_GET_ALL_EXTENDED_BY_COMPANY_ID = "SELECT l.id, l.action_type, l.action_details, l.table_name, l.created, l.user_id, l.atomic, l.company_id, u.username, r.name as role_name, c.name as company_name FROM logger l JOIN user u ON l.user_id=u.id JOIN role r ON u.role_id=r.id JOIN company c ON l.company_id=c.id WHERE l.company_id=? ORDER BY l.created DESC";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<LoggerUserRoleCompany> getAllExtended() {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "LoggerUserRoleCompanyMapping").getResultList();

    }

    @Override
    public List<LoggerUserRoleCompany> getAllExtendedByCompanyId(Integer companyId) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_COMPANY_ID, "LoggerUserRoleCompanyMapping").setParameter(1, companyId).getResultList();
    }
}
