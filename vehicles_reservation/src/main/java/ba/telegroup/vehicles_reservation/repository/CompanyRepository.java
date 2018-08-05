package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.Company;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.CompanyRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Integer>, CompanyRepositoryCustom {

    Company getById(Integer id);
}
