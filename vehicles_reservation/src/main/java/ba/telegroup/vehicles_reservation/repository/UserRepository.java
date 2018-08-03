package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

}
