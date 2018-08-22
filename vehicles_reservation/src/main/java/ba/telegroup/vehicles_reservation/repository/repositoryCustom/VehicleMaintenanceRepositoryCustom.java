package ba.telegroup.vehicles_reservation.repository.repositoryCustom;

import ba.telegroup.vehicles_reservation.model.modelCustom.VehicleMaintenanceVehicleMaintenanceTypeVehicle;

import java.util.List;

public interface VehicleMaintenanceRepositoryCustom {

    List<VehicleMaintenanceVehicleMaintenanceTypeVehicle> getAllExtendedByCompanyIdAndDeleted(Integer companyId, Byte deleted);
    List<VehicleMaintenanceVehicleMaintenanceTypeVehicle> getAllExtendedByCompanyIdAndDeletedAndVehicleId(Integer companyId, Byte deleted, Integer vehicleId);
}
