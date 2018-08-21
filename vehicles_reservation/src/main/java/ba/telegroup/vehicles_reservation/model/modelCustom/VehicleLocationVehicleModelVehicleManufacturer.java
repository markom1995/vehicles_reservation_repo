package ba.telegroup.vehicles_reservation.model.modelCustom;

import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.model.Vehicle;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "VehicleLocationVehicleModelVehicleManufacturerMapping",
        classes = @ConstructorResult(
                targetClass = VehicleLocationVehicleModelVehicleManufacturer.class,
                columns = {
                        @ColumnResult(name="id"),
                        @ColumnResult(name="license_plate"),
                        @ColumnResult(name="vehicle_model_id"),
                        @ColumnResult(name="year"),
                        @ColumnResult(name="engine"),
                        @ColumnResult(name="fuel"),
                        @ColumnResult(name="photo"),
                        @ColumnResult(name="deleted"),
                        @ColumnResult(name="location_id"),
                        @ColumnResult(name="company_id"),
                        @ColumnResult(name="manufacturer_name"),
                        @ColumnResult(name="model_name"),
                        @ColumnResult(name="longitude", type = Double.class),
                        @ColumnResult(name="latitude", type = Double.class)
                }
        )
)
@MappedSuperclass
public class VehicleLocationVehicleModelVehicleManufacturer extends Vehicle {

    private String manufacturerName;
    private String modelName;
    private Double longitude;
    private Double latitude;

    public VehicleLocationVehicleModelVehicleManufacturer() {
    }

    public VehicleLocationVehicleModelVehicleManufacturer(Integer id, String licensePlate, Integer vehicleModelId, Integer year, String engine, String fuel, byte[] photo, Byte deleted, Integer locationId, Integer companyId, String manufacturerName, String modelName, Double longitude, Double latitude){
        setId(id);
        setLicensePlate(licensePlate);
        setVehicleModelId(vehicleModelId);
        setYear(year);
        setEngine(engine);
        setFuel(fuel);
        setPhoto(photo);
        setDeleted(deleted);
        setLocationId(locationId);
        setCompanyId(companyId);
        this.manufacturerName = manufacturerName;
        this.modelName = modelName;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    public String getManufacturerName() {
        return manufacturerName;
    }

    public void setManufacturerName(String manufacturerName) {
        this.manufacturerName = manufacturerName;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
}
