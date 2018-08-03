package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

}
