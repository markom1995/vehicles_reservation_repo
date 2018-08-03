package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/user")
@Controller
@Scope("request")
public class UserController extends GenericController<User, Integer> {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository){
        super(userRepository);
        this.userRepository = userRepository;
    }
}
