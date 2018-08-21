package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyIdRepository;
import ba.telegroup.vehicles_reservation.model.VehicleManufacturer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleManufacturerRepository extends JpaRepository<VehicleManufacturer, Integer>, HasCompanyIdRepository<VehicleManufacturer> {

    VehicleManufacturer getByCompanyIdAndName(Integer companyId, String name);
}
