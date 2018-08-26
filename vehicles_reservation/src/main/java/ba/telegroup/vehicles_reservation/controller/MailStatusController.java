package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.MailStatus;
import ba.telegroup.vehicles_reservation.repository.MailStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/hub/mailStatus")
@Controller
@Scope("request")
public class MailStatusController extends GenericController<MailStatus, Integer> {

    private final MailStatusRepository mailStatusRepository;

    @Autowired
    public MailStatusController(MailStatusRepository mailStatusRepository){
        super(mailStatusRepository);
        this.mailStatusRepository = mailStatusRepository;
    }
}
