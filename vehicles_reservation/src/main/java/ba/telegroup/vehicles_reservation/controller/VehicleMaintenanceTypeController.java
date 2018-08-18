package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.VehicleMaintenanceType;
import ba.telegroup.vehicles_reservation.repository.VehicleMaintenanceTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/hub/vehicleMaintenanceType")
@Controller
@Scope("request")
public class VehicleMaintenanceTypeController extends GenericController<VehicleMaintenanceType, Integer> {

    private final VehicleMaintenanceTypeRepository vehicleMaintenanceTypeRepository;

    @Autowired
    public VehicleMaintenanceTypeController(VehicleMaintenanceTypeRepository vehicleMaintenanceTypeRepository){
        super(vehicleMaintenanceTypeRepository);
        this.vehicleMaintenanceTypeRepository = vehicleMaintenanceTypeRepository;
    }
}
