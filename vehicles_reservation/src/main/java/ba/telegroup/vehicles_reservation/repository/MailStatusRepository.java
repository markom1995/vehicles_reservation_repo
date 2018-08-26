package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.MailStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MailStatusRepository extends JpaRepository<MailStatus, Integer> {
}
