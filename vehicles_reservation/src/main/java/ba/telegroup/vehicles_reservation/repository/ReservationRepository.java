package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyIdAndDeletableRepository;
import ba.telegroup.vehicles_reservation.model.Reservation;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.ReservationRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer>, HasCompanyIdAndDeletableRepository<Reservation>, ReservationRepositoryCustom {

    List<Reservation> getAllByCompanyIdAndVehicleIdAndReservationStatusId(Integer companyId, Integer vehicleId, Integer reservationStatusId);
}
