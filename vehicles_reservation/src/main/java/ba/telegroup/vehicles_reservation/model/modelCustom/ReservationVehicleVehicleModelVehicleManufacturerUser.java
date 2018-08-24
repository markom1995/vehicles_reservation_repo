package ba.telegroup.vehicles_reservation.model.modelCustom;

import ba.telegroup.vehicles_reservation.model.Reservation;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;
import java.sql.Timestamp;
import java.util.Date;

@SqlResultSetMapping(
        name = "ReservationVehicleVehicleModelVehicleManufacturerMapping",
        classes = @ConstructorResult(
                targetClass = ReservationVehicleVehicleModelVehicleManufacturerUser.class,
                columns = {
                        @ColumnResult(name="id"),
                        @ColumnResult(name="name"),
                        @ColumnResult(name="start_time"),
                        @ColumnResult(name="end_time"),
                        @ColumnResult(name="start_km"),
                        @ColumnResult(name="end_km"),
                        @ColumnResult(name="direction"),
                        @ColumnResult(name="reservation_status_id"),
                        @ColumnResult(name="deleted"),
                        @ColumnResult(name="user_id"),
                        @ColumnResult(name="vehicle_id"),
                        @ColumnResult(name="company_id"),
                        @ColumnResult(name="manufacturer_name"),
                        @ColumnResult(name="model_name"),
                        @ColumnResult(name="license_plate"),
                        @ColumnResult(name="year"),
                        @ColumnResult(name="engine"),
                        @ColumnResult(name="fuel"),
                        @ColumnResult(name="photo"),
                        @ColumnResult(name="username"),
                        @ColumnResult(name="first_name"),
                        @ColumnResult(name="last_name"),
                        @ColumnResult(name="status"),
                }
        )
)
@MappedSuperclass
public class ReservationVehicleVehicleModelVehicleManufacturerUser extends Reservation {
    private String manufacturerName;
    private String modelName;
    private String licensePlate;
    private Integer year;
    private String engine;
    private String fuel;
    private byte[] photo;
    private String username;
    private String firstName;
    private String lastName;
    private String status;

    public ReservationVehicleVehicleModelVehicleManufacturerUser(Integer id, String name, Date startTime, Date endTime, Integer startKm, Integer endKm, String direction, Integer reservationStatusId, Byte deleted, Integer userId, Integer vehicleId, Integer companyId, String manufacturerName, String modelName, String licensePlate, Integer year, String engine, String fuel, byte[] photo, String username, String firstName, String lastName, String status){
        setId(id);
        setName(name);
        setStartTime(new Timestamp(startTime.getTime()));
        setEndTime(new Timestamp(endTime.getTime()));
        setStartKm(startKm);
        setEndKm(endKm);
        setDirection(direction);
        setReservationStatusId(reservationStatusId);
        setDeleted(deleted);
        setUserId(userId);
        setVehicleId(vehicleId);
        setCompanyId(companyId);
        this.manufacturerName = manufacturerName;
        this.modelName = modelName;
        this.licensePlate = licensePlate;
        this.year = year;
        this.engine = engine;
        this.fuel = fuel;
        this.photo = photo;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.status = status;
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

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getEngine() {
        return engine;
    }

    public void setEngine(String engine) {
        this.engine = engine;
    }

    public String getFuel() {
        return fuel;
    }

    public void setFuel(String fuel) {
        this.fuel = fuel;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
