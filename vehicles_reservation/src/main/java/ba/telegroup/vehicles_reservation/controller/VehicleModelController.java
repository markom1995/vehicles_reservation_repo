package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.VehicleModel;
import ba.telegroup.vehicles_reservation.repository.VehicleModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/hub/vehicleModel")
@Controller
@Scope("request")
public class VehicleModelController extends GenericController<VehicleModel, Integer> {

    private final VehicleModelRepository vehicleModelRepository;

    @Autowired
    public VehicleModelController(VehicleModelRepository vehicleModelRepository){
        super(vehicleModelRepository);
        this.vehicleModelRepository = vehicleModelRepository;
    }
}
