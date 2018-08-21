package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.VehicleModel;
import ba.telegroup.vehicles_reservation.model.modelCustom.UserRole;
import ba.telegroup.vehicles_reservation.repository.VehicleModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

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

    @RequestMapping(value = "/manufacturerModels/{manufacturerName}", method = RequestMethod.GET)
    public @ResponseBody
    List<VehicleModel> getByCompanyIdAndVehicleManufacturerName(@PathVariable String manufacturerName) {
        return vehicleModelRepository.getByCompanyIdAndVehicleManufacturerName(userBean.getUser().getCompanyId(), manufacturerName);
    }
}
