package ba.telegroup.vehicles_reservation.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.vehicles_reservation.model.Vehicle;
import ba.telegroup.vehicles_reservation.model.modelCustom.VehicleLocationVehicleModelVehicleManufacturer;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.VehicleRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.util.List;

public class VehicleRepositoryImpl implements VehicleRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT v.id, v.license_plate, v.vehicle_model_id, v.year, v.engine, v.fuel, v.photo, v.deleted, v.location_id, v.company_id, vman.name as manufacturer_name, vmod.name as model_name, l.longitude as longitude, l.latitude as latitude FROM vehicle v JOIN vehicle_model vmod ON v.vehicle_model_id=vmod.id JOIN vehicle_manufacturer vman ON vmod.vehicle_manufacturer_id=vman.id JOIN location l ON v.location_id=l.id WHERE v.company_id=? AND v.deleted=?";
    private static final String SQL_GET_ALL_EXTENDED_BY_LOCATION_ID = "SELECT v.id, v.license_plate, v.vehicle_model_id, v.year, v.engine, v.fuel, v.photo, v.deleted, v.location_id, v.company_id, vman.name as manufacturer_name, vmod.name as model_name, l.longitude as longitude, l.latitude as latitude FROM vehicle v JOIN vehicle_model vmod ON v.vehicle_model_id=vmod.id JOIN vehicle_manufacturer vman ON vmod.vehicle_manufacturer_id=vman.id JOIN location l ON v.location_id=l.id WHERE v.company_id=? AND v.deleted=? AND v.location_id=?";
    private static final String SQL_GET_ALL_EXTENDED_BY_START_TIME_AND_END_TIME = "SELECT v.id, v.license_plate, v.vehicle_model_id, v.year, v.engine, v.fuel, v.photo, v.deleted, v.location_id, v.company_id, vman.name as manufacturer_name, vmod.name as model_name, l.longitude as longitude, l.latitude as latitude FROM vehicle v JOIN vehicle_model vmod ON v.vehicle_model_id=vmod.id JOIN vehicle_manufacturer vman ON vmod.vehicle_manufacturer_id=vman.id JOIN location l ON v.location_id=l.id WHERE v.company_id=? AND v.deleted=? AND v.id NOT IN (SELECT r.vehicle_id FROM reservation r WHERE r.company_id=? AND r.deleted=? AND ((CAST(? AS DATETIME) BETWEEN r.start_time AND r.end_time OR CAST(? AS DATETIME) BETWEEN r.start_time AND r.end_time) OR (r.start_time BETWEEN CAST(? AS DATETIME) AND CAST(? AS DATETIME) AND r.end_time BETWEEN CAST(? AS DATETIME) AND CAST(? AS DATETIME))))";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<VehicleLocationVehicleModelVehicleManufacturer> getAllExtendedByCompanyIdAndDeleted(Integer companyId, Byte deleted) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "VehicleLocationVehicleModelVehicleManufacturerMapping").setParameter(1, companyId).setParameter(2, deleted).getResultList();
    }

    @Override
    public List<VehicleLocationVehicleModelVehicleManufacturer> getAllExtendedByCompanyIdAndDeletedAndLocationId(Integer companyId, Byte deleted, Integer locationId) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_LOCATION_ID, "VehicleLocationVehicleModelVehicleManufacturerMapping").setParameter(1, companyId).setParameter(2, deleted).setParameter(3, locationId).getResultList();
    }

    @Override
    public List<VehicleLocationVehicleModelVehicleManufacturer> getAllExtendedFreeByCompanyIdAndDeletedAndStartTimeAndEndTime(Integer companyId, Byte deleted, Timestamp startTime, Timestamp endTime) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_START_TIME_AND_END_TIME, "VehicleLocationVehicleModelVehicleManufacturerMapping").setParameter(1, companyId).setParameter(2, deleted).setParameter(3, companyId).setParameter(4, deleted).setParameter(5, startTime).setParameter(6, endTime).setParameter(7, startTime).setParameter(8, endTime).setParameter(9, startTime).setParameter(10, endTime).getResultList();
    }
}
