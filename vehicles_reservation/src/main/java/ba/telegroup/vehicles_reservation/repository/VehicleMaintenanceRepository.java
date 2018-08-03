package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.VehicleMaintenance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleMaintenanceRepository extends JpaRepository<VehicleMaintenance, Integer> {

}
