package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericHasCompanyIdAndDeletableController;
import ba.telegroup.vehicles_reservation.model.Location;
import ba.telegroup.vehicles_reservation.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/hub/location")
@Controller
@Scope("request")
public class LocationController extends GenericHasCompanyIdAndDeletableController<Location, Integer> {

    private final LocationRepository locationRepository;

    @Autowired
    public LocationController(LocationRepository locationRepository){
        super(locationRepository);
        this.locationRepository = locationRepository;
    }
}
