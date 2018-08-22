package ba.telegroup.vehicles_reservation.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.vehicles_reservation.model.modelCustom.VehicleMaintenanceVehicleMaintenanceTypeVehicle;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.VehicleMaintenanceRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class VehicleMaintenanceRepositoryImpl implements VehicleMaintenanceRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT vm.id, vm.vehicle_maintenance_type_id, vm.description, vm.price, vm.date, vm.deleted, vm.vehicle_id, vm.company_id, vmt.name as vehicle_maintenance_type_name, v.license_plate as license_plate FROM vehicle_maintenance vm JOIN vehicle_maintenance_type vmt ON vm.vehicle_maintenance_type_id=vmt.id JOIN vehicle v ON vm.vehicle_id=v.id WHERE vm.company_id=? AND vm.deleted=?";
    private static final String SQL_GET_ALL_EXTENDED_BY_VEHICLE_ID = "SELECT vm.id, vm.vehicle_maintenance_type_id, vm.description, vm.price, vm.date, vm.deleted, vm.vehicle_id, vm.company_id, vmt.name as vehicle_maintenance_type_name, v.license_plate as license_plate FROM vehicle_maintenance vm JOIN vehicle_maintenance_type vmt ON vm.vehicle_maintenance_type_id=vmt.id JOIN vehicle v ON vm.vehicle_id=v.id WHERE vm.company_id=? AND vm.deleted=? AND v.id=?";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<VehicleMaintenanceVehicleMaintenanceTypeVehicle> getAllExtendedByCompanyIdAndDeleted(Integer companyId, Byte deleted) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "VehicleMaintenanceVehicleMaintenanceTypeVehicleMapping").setParameter(1, companyId).setParameter(2, deleted).getResultList();

    }

    @Override
    public List<VehicleMaintenanceVehicleMaintenanceTypeVehicle> getAllExtendedByCompanyIdAndDeletedAndVehicleId(Integer companyId, Byte deleted, Integer vehicleId) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_VEHICLE_ID, "VehicleMaintenanceVehicleMaintenanceTypeVehicleMapping").setParameter(1, companyId).setParameter(2, deleted).setParameter(3, vehicleId).getResultList();

    }
}
