package ba.telegroup.vehicles_reservation.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.vehicles_reservation.model.VehicleModel;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.VehicleModelRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class VehicleModelRepositoryImpl implements VehicleModelRepositoryCustom {

    private static final String SQL_GET_BY_VEHICLE_MANUFACTURER_NAME = "SELECT vmod.id, vmod.name, vmod.vehicle_manufacturer_id FROM vehicle_model vmod JOIN vehicle_manufacturer vman ON vmod.vehicle_manufacturer_id=vman.id WHERE vman.company_id=? AND vman.name=?";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<VehicleModel> getByCompanyIdAndVehicleManufacturerName(Integer companyId, String manufacturerName) {
        return entityManager.createNativeQuery(SQL_GET_BY_VEHICLE_MANUFACTURER_NAME, "VehicleModelMapping").setParameter(1, companyId).setParameter(2, manufacturerName).getResultList();
    }
}
