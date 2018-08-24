package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericHasCompanyIdAndDeletableController;
import ba.telegroup.vehicles_reservation.model.Reservation;
import ba.telegroup.vehicles_reservation.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequestMapping(value = "/hub/reservation")
@Controller
@Scope("request")
public class ReservationController extends GenericHasCompanyIdAndDeletableController<Reservation, Integer> {

    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationController(ReservationRepository reservationRepository){
        super(reservationRepository);
        this.reservationRepository = reservationRepository;
    }

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll(){
        return reservationRepository.getAllExtendedByCompanyIdAndDeleted(userBean.getUser().getCompanyId(), (byte)0);
    }

    @Transactional
    @RequestMapping(value = "/custom/{vehicleId}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedByVehicleId(@PathVariable Integer vehicleId){
        return reservationRepository.getAllExtendedByCompanyIdAndDeletedAndVehicleId(userBean.getUser().getCompanyId(), (byte)0, vehicleId);
    }
}
