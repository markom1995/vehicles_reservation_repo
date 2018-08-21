package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyIdAndDeletableRepository;
import ba.telegroup.vehicles_reservation.model.Vehicle;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.VehicleRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer>, HasCompanyIdAndDeletableRepository, VehicleRepositoryCustom {

}
