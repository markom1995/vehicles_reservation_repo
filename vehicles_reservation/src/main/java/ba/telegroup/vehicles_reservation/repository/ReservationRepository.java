package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

}
