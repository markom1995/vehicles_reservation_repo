package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.Reservation;
import ba.telegroup.vehicles_reservation.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/hub/reservation")
@Controller
@Scope("request")
public class ReservationController extends GenericController<Reservation, Integer> {

    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationController(ReservationRepository reservationRepository){
        super(reservationRepository);
        this.reservationRepository = reservationRepository;
    }
}
