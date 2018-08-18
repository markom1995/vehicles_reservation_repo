package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.VehicleManufacturer;
import ba.telegroup.vehicles_reservation.repository.VehicleManufacturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/hub/vehicleManufacturer")
@Controller
@Scope("request")
public class VehicleManufacturerController extends GenericController<VehicleManufacturer, Integer> {

    private final VehicleManufacturerRepository vehicleManufacturerRepository;

    @Autowired
    public VehicleManufacturerController(VehicleManufacturerRepository vehicleManufacturerRepository){
        super(vehicleManufacturerRepository);
        this.vehicleManufacturerRepository = vehicleManufacturerRepository;
    }
}
