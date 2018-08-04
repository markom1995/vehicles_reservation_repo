package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Integer> {

    Company getById(Integer id);
}
