package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.ReservationStatus;
import ba.telegroup.vehicles_reservation.repository.ReservationStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/hub/reservationStatus")
@Controller
@Scope("request")
public class ReservationStatusController extends GenericController<ReservationStatus, Integer> {

    private final ReservationStatusRepository reservationStatusRepository;

    @Autowired
    public ReservationStatusController(ReservationStatusRepository reservationStatusRepository){
        super(reservationStatusRepository);
        this.reservationStatusRepository = reservationStatusRepository;
    }
}
