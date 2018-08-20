package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyIdRepository;
import ba.telegroup.vehicles_reservation.model.Logger;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.LoggerRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoggerRepository extends JpaRepository<Logger, Integer>, LoggerRepositoryCustom {

}
