package ba.telegroup.vehicles_reservation.repository.repositoryCustom;

import ba.telegroup.vehicles_reservation.model.Vehicle;
import ba.telegroup.vehicles_reservation.model.modelCustom.VehicleLocationVehicleModelVehicleManufacturer;

import java.sql.Timestamp;
import java.util.List;

public interface VehicleRepositoryCustom {

    List<VehicleLocationVehicleModelVehicleManufacturer> getAllExtendedByCompanyIdAndDeleted(Integer companyId, Byte deleted);
    List<VehicleLocationVehicleModelVehicleManufacturer> getAllExtendedByCompanyIdAndDeletedAndLocationId(Integer companyId, Byte deleted, Integer locationId);
    List<VehicleLocationVehicleModelVehicleManufacturer> getAllExtendedFreeByCompanyIdAndDeletedAndStartTimeAndEndTime(Integer companyId, Byte deleted, Timestamp startTime, Timestamp endTime);
    VehicleLocationVehicleModelVehicleManufacturer getExtendedById(Integer id);
}
