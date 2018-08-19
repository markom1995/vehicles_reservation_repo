package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.controller.genericController.GenericDeletableController;
import ba.telegroup.vehicles_reservation.model.Company;
import ba.telegroup.vehicles_reservation.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RequestMapping(value = "/hub/company")
@Controller
@Scope("request")
public class CompanyController extends GenericDeletableController<Company, Integer> {

    private final CompanyRepository companyRepository;

    @Autowired
    public CompanyController(CompanyRepository companyRepository){
        super(companyRepository);
        this.companyRepository = companyRepository;
    }
}
