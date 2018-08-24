package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationStatusRepository extends JpaRepository<ReservationStatus, Integer> {
}
