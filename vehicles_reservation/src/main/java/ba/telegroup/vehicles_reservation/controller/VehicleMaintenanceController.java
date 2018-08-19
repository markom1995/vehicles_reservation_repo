package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericHasCompanyIdAndDeletableController;
import ba.telegroup.vehicles_reservation.model.VehicleMaintenance;
import ba.telegroup.vehicles_reservation.repository.VehicleMaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/hub/vehicleMaintenance")
@Controller
@Scope("request")
public class VehicleMaintenanceController extends GenericHasCompanyIdAndDeletableController<VehicleMaintenance, Integer> {

    private final VehicleMaintenanceRepository vehicleMaintenanceRepository;

    @Autowired
    public VehicleMaintenanceController(VehicleMaintenanceRepository vehicleMaintenanceRepository){
        super(vehicleMaintenanceRepository);
        this.vehicleMaintenanceRepository = vehicleMaintenanceRepository;
    }
}
