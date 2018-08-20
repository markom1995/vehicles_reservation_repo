package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.common.exceptions.ForbiddenException;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.Logger;
import ba.telegroup.vehicles_reservation.model.modelCustom.LoggerUserRoleCompany;
import ba.telegroup.vehicles_reservation.repository.LoggerRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@RequestMapping(value = "/hub/logger")
@Controller
@Scope("request")
public class LoggerController extends GenericController<Logger, Integer> {

    private final LoggerRepository loggerRepository;

    @Value("${superAdmin.id}")
    private Integer superAdmin;

    @Value("${admin.id}")
    private Integer admin;

    @Value("${user.id}")
    private Integer user;

    @Value("${forbidden.notAuthorized}")
    private String forbiddenNotAuthorized;

    public LoggerController(LoggerRepository loggerRepository) {
        super(loggerRepository);
        this.loggerRepository = loggerRepository;
    }

    @RequestMapping(value = "/custom", method = RequestMethod.GET)
    public @ResponseBody
    List<LoggerUserRoleCompany> getAllExtended() throws ForbiddenException {
        if(userBean.getUser().getRoleId().equals(Integer.valueOf(superAdmin))){
            return loggerRepository.getAllExtended();
        }
        else if(userBean.getUser().getRoleId().equals(Integer.valueOf(admin))){
            return loggerRepository.getAllExtendedByCompanyId(userBean.getUser().getCompanyId());
        }
        else{
            throw new ForbiddenException(forbiddenNotAuthorized);
        }
    }
}
