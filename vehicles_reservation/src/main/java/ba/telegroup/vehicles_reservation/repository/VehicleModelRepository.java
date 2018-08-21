package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.model.VehicleModel;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.VehicleModelRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleModelRepository extends JpaRepository<VehicleModel, Integer>, VehicleModelRepositoryCustom {

    VehicleModel getByVehicleManufacturerIdAndName(Integer manufacturerId, String name);
}
