package ba.telegroup.vehicles_reservation.repository.repositoryCustom;

import ba.telegroup.vehicles_reservation.model.VehicleModel;

import java.util.List;

public interface VehicleModelRepositoryCustom {

    List<VehicleModel> getByCompanyIdAndVehicleManufacturerName(Integer companyId, String manufacturerName);
}
