package ba.telegroup.vehicles_reservation.repository;

import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyIdAndDeletableRepository;
import ba.telegroup.vehicles_reservation.model.VehicleMaintenance;
import ba.telegroup.vehicles_reservation.repository.repositoryCustom.VehicleMaintenanceRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleMaintenanceRepository extends JpaRepository<VehicleMaintenance, Integer>, HasCompanyIdAndDeletableRepository<VehicleMaintenance>, VehicleMaintenanceRepositoryCustom {

    List<VehicleMaintenance> getAllByCompanyIdAndDeleted(Integer companyId, Byte deleted);
}
