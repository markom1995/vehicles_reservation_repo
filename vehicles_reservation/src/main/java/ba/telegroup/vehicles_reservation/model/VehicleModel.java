package ba.telegroup.vehicles_reservation.model;

import javax.persistence.*;

@Entity
public class VehicleModel {
    private Integer id;
    private String name;
    private Integer vehicleManufacturerId;

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
    @Column(name = "name", nullable = false, length = 128)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "vehicle_manufacturer_id", nullable = false)
    public Integer getVehicleManufacturerId() {
        return vehicleManufacturerId;
    }

    public void setVehicleManufacturerId(Integer vehicleManufacturerId) {
        this.vehicleManufacturerId = vehicleManufacturerId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        VehicleModel that = (VehicleModel) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        if (vehicleManufacturerId != null ? !vehicleManufacturerId.equals(that.vehicleManufacturerId) : that.vehicleManufacturerId != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (vehicleManufacturerId != null ? vehicleManufacturerId.hashCode() : 0);
        return result;
    }
}
