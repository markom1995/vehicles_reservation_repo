package ba.telegroup.vehicles_reservation.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.vehicles_reservation.model.modelCustom.ReservationVehicleVehicleModelVehicleManufacturerUser;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.ReservationRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class ReservationRepositoryImpl implements ReservationRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT r.id, r.name, r.start_time, r.end_time, r.start_km, r.end_km, r.direction, r.reservation_status_id, r.deleted, r.user_id, r.vehicle_id, r.company_id, vman.name as manufacturer_name, vmod.name as model_name, v.license_plate, v.year, v.engine, v.fuel, v.photo, u.username, u.first_name, u.last_name, rs.name as status FROM reservation r JOIN vehicle v ON r.vehicle_id=v.id JOIN vehicle_model vmod ON v.vehicle_model_id=vmod.id JOIN vehicle_manufacturer vman ON vman.id=vmod.vehicle_manufacturer_id JOIN user u ON r.user_id=u.id JOIN reservation_status rs ON r.reservation_status_id=rs.id WHERE r.company_id=? AND r.deleted=?";
    private static final String SQL_GET_ALL_EXTENDED_BY_VEHICLE_ID = "SELECT r.id, r.name, r.start_time, r.end_time, r.start_km, r.end_km, r.direction, r.reservation_status_id, r.deleted, r.user_id, r.vehicle_id, r.company_id, vman.name as manufacturer_name, vmod.name as model_name, v.license_plate, v.year, v.engine, v.fuel, v.photo, u.username, u.first_name, u.last_name, rs.name as status FROM reservation r JOIN vehicle v ON r.vehicle_id=v.id JOIN vehicle_model vmod ON v.vehicle_model_id=vmod.id JOIN vehicle_manufacturer vman ON vman.id=vmod.vehicle_manufacturer_id JOIN user u ON r.user_id=u.id JOIN reservation_status rs ON r.reservation_status_id=rs.id WHERE r.company_id=? AND r.deleted=? AND r.vehicle_id=? ORDER BY r.start_time DESC";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<ReservationVehicleVehicleModelVehicleManufacturerUser> getAllExtendedByCompanyIdAndDeleted(Integer companyId, Byte deleted) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "ReservationVehicleVehicleModelVehicleManufacturerMapping").setParameter(1, companyId).setParameter(2, deleted).getResultList();
    }

    @Override
    public List<ReservationVehicleVehicleModelVehicleManufacturerUser> getAllExtendedByCompanyIdAndDeletedAndVehicleId(Integer companyId, Byte deleted, Integer vehicleId) {
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_VEHICLE_ID, "ReservationVehicleVehicleModelVehicleManufacturerMapping").setParameter(1, companyId).setParameter(2, deleted).setParameter(3, vehicleId).getResultList();
    }
}
