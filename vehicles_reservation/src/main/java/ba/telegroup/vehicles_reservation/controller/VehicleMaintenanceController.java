package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericHasCompanyIdAndDeletableController;
import ba.telegroup.vehicles_reservation.model.VehicleMaintenance;
import ba.telegroup.vehicles_reservation.repository.VehicleMaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

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

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll(){
        return vehicleMaintenanceRepository.getAllExtendedByCompanyIdAndDeleted(userBean.getUser().getCompanyId(), (byte)0);
    }

    @Transactional
    @RequestMapping(value = "/custom/{vehicleId}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedByVehicleId(@PathVariable Integer vehicleId){
        return vehicleMaintenanceRepository.getAllExtendedByCompanyIdAndDeletedAndVehicleId(userBean.getUser().getCompanyId(), (byte)0, vehicleId);
    }
}
