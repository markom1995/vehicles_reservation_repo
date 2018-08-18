package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.Role;
import ba.telegroup.vehicles_reservation.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/hub/role")
@Controller
@Scope("request")
public class RoleController extends GenericController<Role, Integer> {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleController(RoleRepository roleRepository){
        super(roleRepository);
        this.roleRepository = roleRepository;
    }
}
