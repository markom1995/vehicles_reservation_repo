package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.model.Company;
import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.model.modelCustom.CompanyUser;
import ba.telegroup.vehicles_reservation.repository.CompanyRepository;
import ba.telegroup.vehicles_reservation.repository.UserRepository;
import ba.telegroup.vehicles_reservation.util.Notification;
import ba.telegroup.vehicles_reservation.util.Util;
import ba.telegroup.vehicles_reservation.util.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;

@RequestMapping(value = "/hub/company")
@Controller
@Scope("request")
public class CompanyController extends GenericController<Company, Integer> {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${randomString.length}")
    private Integer randomStringLength;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.delete}")
    private String badRequestDelete;

    @Value("${badRequest.stringMaxLength}")
    private String badRequestStringMaxLength;

    @Value("${badRequest.binaryLength}")
    private String badRequestBinaryLength;

    @Value("${badRequest.validateEmail}")
    private String badRequestValidateEmail;

    @Value("${longblob.length}")
    private Long longblobLength;

    @Autowired
    public CompanyController(CompanyRepository companyRepository, UserRepository userRepository) {
        super(companyRepository);
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll() {
        return companyRepository.getAllExtended();
    }

    @Override
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody
    CompanyUser findById(@PathVariable Integer id) {
        return companyRepository.getAllExtendedById(id);
    }

    @Transactional
    @RequestMapping(value = "/custom", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    CompanyUser insertExtended(@RequestBody CompanyUser companyUser) throws BadRequestException {
        if (Validator.stringMaxLength(companyUser.getName(), 128)) {
            if(Validator.binaryMaxLength(companyUser.getLogo(), longblobLength)){
                if(Validator.validateEmail(companyUser.getEmail())){
                    Company company = new Company();
                    company.setId(null);
                    company.setName(companyUser.getName());
                    company.setDeleted((byte) 0);
                    company.setLogo(companyUser.getLogo());
                    if(repo.saveAndFlush(company) != null){
                        entityManager.refresh(company);
                        logCreateAction(company);

                        String randomToken = Util.randomString(randomStringLength);
                        User user = new User();
                        user.setActive((byte) 0);
                        user.setDeleted((byte) 0);
                        user.setUsername(null);
                        user.setCompanyId(company.getId());
                        user.setEmail(companyUser.getEmail());
                        user.setFirstName(null);
                        user.setLastName(null);
                        user.setPassword(null);
                        user.setToken(randomToken);
                        user.setTokenTime(new Timestamp(System.currentTimeMillis()));
                        user.setId(null);
                        user.setPhoto(null);
                        user.setRoleId(2);

                        if(userRepository.saveAndFlush(user) != null){
                            Notification.sendRegistrationLink(user.getEmail().trim(), randomToken);
                            companyUser.setId(company.getId());

                            return companyUser;
                        }
                        throw new BadRequestException(badRequestInsert);
                    }
                    throw new BadRequestException(badRequestInsert);
                }
                throw new BadRequestException(badRequestValidateEmail);
            }
            throw new BadRequestException(badRequestBinaryLength.replace("{tekst}", "slike za logo"));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(128)));
    }

    @Transactional
    @RequestMapping(value = "/custom/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String updateExtended(@PathVariable Integer id, @RequestBody CompanyUser companyUser) throws BadRequestException {
        if (Validator.stringMaxLength(companyUser.getName(), 128)) {
            if(Validator.binaryMaxLength(companyUser.getLogo(), longblobLength)){
                if(Validator.validateEmail(companyUser.getEmail())){
                    Company company = companyRepository.findById(id).orElse(null);
                    User adminUser = userRepository.getByCompanyIdAndRoleIdAndActiveAndDeleted(Objects.requireNonNull(company).getId(), 2, (byte) 1, (byte) 0);
                    Company oldObject = cloner.deepClone(company);

                    company.setName(companyUser.getName());
                    company.setLogo(companyUser.getLogo());
                    if(repo.saveAndFlush(company) != null){
                        entityManager.refresh(company);
                        logUpdateAction(company, oldObject);
                        if (adminUser != null && !companyUser.getEmail().equals(adminUser.getEmail())) {
                            adminUser.setActive((byte) 0);
                            if(userRepository.saveAndFlush(adminUser) != null){
                                String randomToken = Util.randomString(randomStringLength);
                                User newAdminUser = new User();
                                newAdminUser.setId(null);
                                newAdminUser.setActive((byte) 0);
                                newAdminUser.setCompanyId(company.getId());
                                newAdminUser.setDeleted((byte) 0);
                                newAdminUser.setEmail(companyUser.getEmail());
                                newAdminUser.setFirstName(null);
                                newAdminUser.setLastName(null);
                                newAdminUser.setPassword(null);
                                newAdminUser.setId(null);
                                newAdminUser.setToken(randomToken);
                                newAdminUser.setTokenTime(new Timestamp(System.currentTimeMillis()));
                                newAdminUser.setPhoto(null);
                                newAdminUser.setRoleId(2);

                                if(userRepository.saveAndFlush(newAdminUser) != null){
                                    Notification.sendRegistrationLink(companyUser.getEmail().trim(), randomToken);

                                    return "Success";
                                }
                                throw new BadRequestException(badRequestUpdate);
                            }
                            throw new BadRequestException(badRequestUpdate);
                        }

                        return "Success";
                    }
                    throw new BadRequestException(badRequestUpdate);
                }
                throw new BadRequestException(badRequestValidateEmail);
            }
            throw new BadRequestException(badRequestBinaryLength.replace("{tekst}", "slike za logo"));
        }
        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "naziva").replace("{broj}", String.valueOf(128)));
    }
}
