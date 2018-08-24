package ba.telegroup.vehicles_reservation.repository.repositoryCustom;

import ba.telegroup.vehicles_reservation.model.modelCustom.ReservationVehicleVehicleModelVehicleManufacturerUser;

import java.util.List;

public interface ReservationRepositoryCustom {

    List<ReservationVehicleVehicleModelVehicleManufacturerUser> getAllExtendedByCompanyIdAndDeleted(Integer companyId, Byte deleted);
    List<ReservationVehicleVehicleModelVehicleManufacturerUser> getAllExtendedByCompanyIdAndDeletedAndVehicleId(Integer companyId, Byte deleted, Integer vehicleId);
}
