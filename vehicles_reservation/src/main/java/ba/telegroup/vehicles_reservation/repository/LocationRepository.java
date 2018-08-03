package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Integer> {

}
