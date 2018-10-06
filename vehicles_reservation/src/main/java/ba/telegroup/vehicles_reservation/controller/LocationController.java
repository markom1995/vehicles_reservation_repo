package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericHasCompanyIdAndDeletableController;
import ba.telegroup.vehicles_reservation.model.Location;
import ba.telegroup.vehicles_reservation.model.Reservation;
import ba.telegroup.vehicles_reservation.model.Vehicle;
import ba.telegroup.vehicles_reservation.repository.LocationRepository;
import ba.telegroup.vehicles_reservation.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequestMapping(value = "/hub/location")
@Controller
@Scope("request")
public class LocationController extends GenericHasCompanyIdAndDeletableController<Location, Integer> {

    private final LocationRepository locationRepository;
    private final VehicleRepository vehicleRepository;

    @Value("${badRequest.noLocation}")
    private String badRequestNoLocation;

    @Value("${badRequest.carOnLocation}")
    private String badRequestCarOnLocation;

    @Autowired
    public LocationController(LocationRepository locationRepository, VehicleRepository vehicleRepository){
        super(locationRepository);
        this.locationRepository = locationRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    @Transactional
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        Location location = locationRepository.findById(id).orElse(null);
        if(location != null){
            Integer numberOfVehicles = vehicleRepository.countAllByCompanyIdAndLocationId(userBean.getUser().getCompanyId(), location.getId());
            if(numberOfVehicles.equals(Integer.valueOf(0))){
                location.setDeleted((byte) 1);
                logDeleteAction(location);

                return "Success";
            }
            throw new BadRequestException(badRequestCarOnLocation);
        }
        throw new BadRequestException(badRequestNoLocation);
    }
}
