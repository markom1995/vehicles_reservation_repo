package ba.telegroup.vehicles_reservation.model;

import ba.telegroup.vehicles_reservation.common.interfaces.Deletable;
import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyId;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.Size;
import java.util.Arrays;
import java.util.Date;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Vehicle implements Deletable, HasCompanyId {
    private Integer id;

    @NotNull(message = "Broj registarske tablice vozila je obavezno unijeti.")
    @Size(min = 1, max = 128, message = "Broj registarske tablice vozila mora sadr&#x017E;ati najmanje 1 karakter, a najvi&#x0161;e 128 karaktera.")
    private String licensePlate;

    private Integer vehicleModelId;

    @NotNull(message = "Godinu vozila je obavezno unijeti.")
    @Positive(message = "Godina vozila mora biti pozitivan broj.")
    @Max(2147483647)
    private Integer year;

    @NotNull(message = "Ja&#x010D;inu vozila je obavezno unijeti.")
    @Size(min = 1, max = 128, message = "Ja&#x010D;ina vozila mora sadr&#x017E;ati najmanje 1 karakter, a najvi&#x0161;e 128 karaktera.")
    private String engine;

    @NotNull(message = "Vrstu goriva vozila je obavezno unijeti.")
    @Size(min = 1, max = 128, message = "Vrsta goriva vozila mora sadr&#x017E;ati najmanje 1 karakter, a najvi&#x0161;e 128 karaktera.")
    private String fuel;

    private byte[] photo;

    private Byte deleted;

    private Integer locationId;

    private Integer companyId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "license_plate", nullable = false, length = 128)
    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    @Basic
    @Column(name = "vehicle_model_id", nullable = false)
    public Integer getVehicleModelId() {
        return vehicleModelId;
    }

    public void setVehicleModelId(Integer vehicleModelId) {
        this.vehicleModelId = vehicleModelId;
    }

    @Basic
    @Column(name = "year", nullable = false)
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    @Basic
    @Column(name = "engine", nullable = false, length = 128)
    public String getEngine() {
        return engine;
    }

    public void setEngine(String engine) {
        this.engine = engine;
    }

    @Basic
    @Column(name = "fuel", nullable = false, length = 128)
    public String getFuel() {
        return fuel;
    }

    public void setFuel(String fuel) {
        this.fuel = fuel;
    }

    @Basic
    @Column(name = "photo", nullable = true)
    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    @Basic
    @Column(name = "deleted", nullable = false)
    public Byte getDeleted() {
        return deleted;
    }

    public void setDeleted(Byte deleted) {
        this.deleted = deleted;
    }

    @Basic
    @Column(name = "location_id", nullable = false)
    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    @Basic
    @Column(name = "company_id", nullable = false)
    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Vehicle vehicle = (Vehicle) o;

        if (id != null ? !id.equals(vehicle.id) : vehicle.id != null) return false;
        if (licensePlate != null ? !licensePlate.equals(vehicle.licensePlate) : vehicle.licensePlate != null) return false;
        if (vehicleModelId != null ? !vehicleModelId.equals(vehicle.vehicleModelId) : vehicle.vehicleModelId != null)
            return false;
        if (year != null ? !year.equals(vehicle.year) : vehicle.year != null) return false;
        if (engine != null ? !engine.equals(vehicle.engine) : vehicle.engine != null) return false;
        if (fuel != null ? !fuel.equals(vehicle.fuel) : vehicle.fuel != null) return false;
        if (!Arrays.equals(photo, vehicle.photo)) return false;
        if (deleted != null ? !deleted.equals(vehicle.deleted) : vehicle.deleted != null) return false;
        if (locationId != null ? !locationId.equals(vehicle.locationId) : vehicle.locationId != null) return false;
        if (companyId != null ? !companyId.equals(vehicle.companyId) : vehicle.companyId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (licensePlate != null ? licensePlate.hashCode() : 0);
        result = 31 * result + (vehicleModelId != null ? vehicleModelId.hashCode() : 0);
        result = 31 * result + (year != null ? year.hashCode() : 0);
        result = 31 * result + (engine != null ? engine.hashCode() : 0);
        result = 31 * result + (fuel != null ? fuel.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(photo);
        result = 31 * result + (deleted != null ? deleted.hashCode() : 0);
        result = 31 * result + (locationId != null ? locationId.hashCode() : 0);
        result = 31 * result + (companyId != null ? companyId.hashCode() : 0);
        return result;
    }
}
