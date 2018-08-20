package ba.telegroup.vehicles_reservation.repository.repositoryCustom;

import ba.telegroup.vehicles_reservation.model.modelCustom.LoggerUserRoleCompany;

import java.util.List;

public interface LoggerRepositoryCustom {

    List<LoggerUserRoleCompany> getAllExtended();
    List<LoggerUserRoleCompany> getAllExtendedByCompanyId(Integer companyId);
}
