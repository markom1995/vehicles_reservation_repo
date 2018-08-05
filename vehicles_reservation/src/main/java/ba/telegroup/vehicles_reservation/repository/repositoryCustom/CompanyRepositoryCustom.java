package ba.telegroup.vehicles_reservation.repository.repositoryCustom;

import ba.telegroup.vehicles_reservation.model.modelCustom.CompanyUser;

import java.util.List;

public interface CompanyRepositoryCustom {

    List<CompanyUser> getAllExtended();
    CompanyUser getAllExtendedById(Integer userId);
}
