package ba.telegroup.vehicles_reservation.repository.repositoryCustom;

import ba.telegroup.vehicles_reservation.model.modelCustom.VehicleLocationVehicleModelVehicleManufacturer;

import java.util.List;

public interface VehicleRepositoryCustom {

    List<VehicleLocationVehicleModelVehicleManufacturer> getAllExtendedByCompanyIdAndDeleted(Integer companyId, Byte deleted);
}
