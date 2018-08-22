package ba.telegroup.vehicles_reservation.model.modelCustom;

import ba.telegroup.vehicles_reservation.model.VehicleMaintenance;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;
import java.util.Date;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "VehicleMaintenanceVehicleMaintenanceTypeVehicleMapping",
        classes = @ConstructorResult(
                targetClass = VehicleMaintenanceVehicleMaintenanceTypeVehicle.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "vehicle_maintenance_type_id"),
                        @ColumnResult(name="description"),
                        @ColumnResult(name="price", type = Double.class),
                        @ColumnResult(name="date", type = Date.class),
                        @ColumnResult(name="deleted"),
                        @ColumnResult(name="vehicle_id"),
                        @ColumnResult(name="company_id"),
                        @ColumnResult(name="vehicle_maintenance_type_name"),
                        @ColumnResult(name="license_plate")
                }
        )
)
@MappedSuperclass
public class VehicleMaintenanceVehicleMaintenanceTypeVehicle extends VehicleMaintenance {

    private String vehicleMaintenanceTypeName;
    private String licensePlate;

    public VehicleMaintenanceVehicleMaintenanceTypeVehicle(Integer id, Integer vehicleMaintenanceTypeId, String description, Double price, Date date, Byte deleted, Integer vehicleId, Integer companyId, String vehicleMaintenanceTypeName, String licensePlate){
        setId(id);
        setVehicleMaintenanceTypeId(vehicleMaintenanceTypeId);
        setDescription(description);
        setPrice(price);
        setDate(new java.sql.Date(date.getTime()));
        setDeleted(deleted);
        setVehicleId(vehicleId);
        setCompanyId(companyId);
        this.vehicleMaintenanceTypeName = vehicleMaintenanceTypeName;
        this.licensePlate = licensePlate;
    }

    public String getVehicleMaintenanceTypeName() {
        return vehicleMaintenanceTypeName;
    }

    public void setVehicleMaintenanceTypeName(String vehicleMaintenanceTypeName) {
        this.vehicleMaintenanceTypeName = vehicleMaintenanceTypeName;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }
}
