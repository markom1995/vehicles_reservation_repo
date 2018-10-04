package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.common.exceptions.ForbiddenException;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericController;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericHasCompanyIdAndDeletableController;
import ba.telegroup.vehicles_reservation.model.Company;
import ba.telegroup.vehicles_reservation.model.Location;
import ba.telegroup.vehicles_reservation.model.User;
import ba.telegroup.vehicles_reservation.model.modelCustom.UserRole;
import ba.telegroup.vehicles_reservation.repository.CompanyRepository;
import ba.telegroup.vehicles_reservation.repository.LocationRepository;
import ba.telegroup.vehicles_reservation.repository.UserRepository;
import ba.telegroup.vehicles_reservation.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.util.List;

@RequestMapping(value = "/hub/user")
@Controller
@Scope("request")
public class UserController extends GenericHasCompanyIdAndDeletableController<User, Integer> {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final LocationRepository locationRepository;
    private final Notification notification;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${randomString.length}")
    private Integer randomStringLength;

    @Value("${superAdmin.id}")
    private Integer superAdmin;
    @Value("${admin.id}")
    private Integer admin;
    @Value("${user.id}")
    private Integer user;

    @Value("${badRequest.noUser}")
    private String badRequestNoUser;

    @Value("${badRequest.noLocation}")
    private String badRequestNoLocation;

    @Value("${badRequest.acceptRequestBadRole}")
    private String badRequestAcceptRequestBadRole;

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

    @Value("${badRequest.registration}")
    private String badRequestRegistration;

    @Value("${badRequest.usernameExists}")
    private String badRequestUsernameExists;

    @Value("${badRequest.passwordStrength}")
    private String badRequestPasswordStrength;

    @Value("${longblob.length}")
    private Long longblobLength;

    @Value("${badRequest.validateEmail}")
    private String badRequestValidateEmail;

    @Value("${badRequest.oldPassword}")
    private String badRequestOldPassword;

    @Value("${badRequest.repeatedNewPassword}")
    private String badRequestRepeatedNewPassword;

    @Value("${badRequest.resetPassword}")
    private String badRequestResetPassword;

    @Value("${badRequest.deactivateUser}")
    private String badRequestDeactivateUser;

    @Value("${badRequest.emailExists}")
    private String badRequestEmailExists;

    @Autowired
    public UserController(UserRepository userRepository, CompanyRepository companyRepository, LocationRepository locationRepository, Notification notification){
        super(userRepository);
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.locationRepository = locationRepository;
        this.notification = notification;
    }

    @Override
    @Transactional
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String update(@PathVariable Integer id, @RequestBody User user) throws BadRequestException {
        if(userBean.getUser().getId().equals(id)){
            if (Validator.stringMaxLength(user.getFirstName(), 128)) {
                if (Validator.stringMaxLength(user.getLastName(), 128)) {
                    if(Validator.binaryMaxLength(user.getPhoto(), longblobLength)){
                        User userTemp = userRepository.findById(id).orElse(null);
                        User oldUser = cloner.deepClone(userRepository.findById(id).orElse(null));

                        userTemp.setFirstName(user.getFirstName());
                        userTemp.setLastName(user.getLastName());
                        userTemp.setPhoto(user.getPhoto());
                        logUpdateAction(user, oldUser);

                        return "Success";
                    }
                    throw new BadRequestException(badRequestBinaryLength.replace("{tekst}", "slike"));
                }
                throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "prezimena").replace("{broj}", String.valueOf(128)));
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "imena").replace("{broj}", String.valueOf(128)));
        }
        throw new BadRequestException(badRequestUpdate);
    }

    @RequestMapping(value = "/companyUsers/{companyId}", method = RequestMethod.GET)
    public @ResponseBody
    List<UserRole> getByCompanyIdAndDeleted(@PathVariable Integer companyId) throws BadRequestException {
        return userRepository.getByCompanyIdAndDeletedAndActive(companyId, (byte)0, (byte)1);
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody
    User login(@RequestBody UserInformation userInformation) throws ForbiddenException {
        User user = userRepository.login(userInformation);
        if (user == null) {
            throw new ForbiddenException("Forbidden");
        }
        else{
            user.setPassword(null);
            userBean.setUser(user);
            userBean.setLoggedIn(true);

            return userBean.getUser();
        }
    }

    @SuppressWarnings("SameReturnValue")
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public @ResponseBody
    String logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        return "Success";
    }

    @Override
    @RequestMapping(method = RequestMethod.POST)
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    User insert(@RequestBody User user) throws BadRequestException {
        if(userRepository.countAllByCompanyIdAndEmail(user.getCompanyId(), user.getEmail()).compareTo(Integer.valueOf(0)) == 0){
            if(Validator.validateEmail(user.getEmail())){
                String randomToken = Util.randomString(randomStringLength);
                User newUser = new User();
                newUser.setEmail(user.getEmail());
                newUser.setUsername(null);
                newUser.setPassword(null);
                newUser.setFirstName(null);
                newUser.setLastName(null);
                newUser.setPhoto(null);
                newUser.setActive((byte) 0);
                newUser.setDeleted((byte) 0);
                newUser.setCompanyId(user.getCompanyId());
                newUser.setRoleId(user.getRoleId());
                newUser.setToken(randomToken);
                newUser.setTokenTime(new Timestamp(System.currentTimeMillis()));
                newUser.setRequest((byte) 0);
                if(userRepository.saveAndFlush(newUser) != null){
                    entityManager.refresh(newUser);
                    logCreateAction(newUser);
                    notification.sendRegistrationLink(user.getEmail().trim(), randomToken);

                    return newUser;
                }
                throw new BadRequestException(badRequestInsert);
            }
            throw new BadRequestException(badRequestValidateEmail);
        }
        throw new BadRequestException(badRequestEmailExists);
    }

    @Transactional
    @RequestMapping(value = "/acceptRequest", method = RequestMethod.POST)
    public @ResponseBody
    String acceptRequest(@RequestParam("userId") Integer userId, @RequestParam("locationId") Integer locationId) throws BadRequestException {
        User user = userRepository.findById(userId).orElse(null);
        if(user != null){
            Location location = locationRepository.findById(locationId).orElse(null);
            if(location != null){
                if(user.getRoleId() != null && user.getRoleId().equals(Integer.valueOf(3)) && user.getRequest().equals(Byte.valueOf((byte) 1))){
                    User oldObject = user;
                    user.setLocationId(locationId);
                    user.setRequest((byte) 0);
                    user.setActive((byte) 1);
                    if (userRepository.saveAndFlush(user) != null) {
                        logUpdateAction(user, oldObject);
                        notification.sendActivationNotification(user.getEmail().trim());

                        return "Success";
                    }
                    else{
                        throw new BadRequestException(badRequestUpdate);
                    }
                }
                throw new BadRequestException(badRequestAcceptRequestBadRole);
            }
            throw new BadRequestException(badRequestNoLocation);
        }
        throw new BadRequestException(badRequestNoUser);
    }

    @Transactional
    @RequestMapping(value = "/rejectRequest", method = RequestMethod.POST)
    public @ResponseBody
    String rejectRequest(@RequestParam("userId") Integer userId) throws BadRequestException {
        User user = userRepository.findById(userId).orElse(null);
        if(user != null){
            if(user.getRoleId() != null && user.getRoleId().equals(Integer.valueOf(3)) && user.getRequest().equals(Byte.valueOf((byte) 1))){
                User oldObject = user;
                user.setRequest((byte) 0);
                user.setDeleted((byte) 1);
                if (userRepository.saveAndFlush(user) != null) {
                    logUpdateAction(user, oldObject);

                    return "Success";
                }
                else{
                    throw new BadRequestException(badRequestUpdate);
                }
            }
            throw new BadRequestException(badRequestAcceptRequestBadRole);
        }
        throw new BadRequestException(badRequestNoUser);
    }

    @Transactional
    @RequestMapping(value = "/numberOfRequests", method = RequestMethod.GET)
    public @ResponseBody
    Integer countAllRequests() {
        return userRepository.countAllByCompanyIdAndRequest(userBean.getUser().getCompanyId(), (byte) 1);
    }

    @Transactional
    @RequestMapping(value = "/allRequests", method = RequestMethod.GET)
    public @ResponseBody
    List<User> getAllRequests() {
        List<User> users = cloner.deepClone(userRepository.getAllByCompanyIdAndRequest(userBean.getUser().getCompanyId(), (byte) 1));
        for(User user : users){
            user.setPassword(null);
        }

        return users;
    }

    @RequestMapping(value = "/registration/{token}", method = RequestMethod.GET)
    public @ResponseBody
    User requestForRegistration(@PathVariable String token) {
        User user = userRepository.getByToken(token);
        if (user == null) {
            return null;
        }

        if (new Timestamp(System.currentTimeMillis()).before(new Timestamp(user.getTokenTime().getTime() + 10 * 60 * 1000))) {
            return user;
        } else {
            return null;
        }
    }

    @RequestMapping(value = "/updatePassword", method = RequestMethod.POST)
    public @ResponseBody
    String updatePassword(@RequestBody PasswordInformation passwordInformation) throws BadRequestException{
        User user = userRepository.findById(userBean.getUser().getId()).orElse(null);
        if(user != null){
            if(passwordInformation.getOldPassword() != null && user.getPassword().trim().equals(Util.hashPassword(passwordInformation.getOldPassword().trim()))){
                if(passwordInformation.getNewPassword() != null && Validator.passwordChecking(passwordInformation.getNewPassword())){
                    if(passwordInformation.getRepeatedNewPassword() != null && passwordInformation.getNewPassword().trim().equals(passwordInformation.getRepeatedNewPassword().trim())){
                        user.setPassword(Util.hashPassword(passwordInformation.getNewPassword()));
                        if(userRepository.saveAndFlush(user) != null){
                            return "Success";
                        }
                        throw new BadRequestException(badRequestUpdate);
                    }
                    throw new BadRequestException(badRequestRepeatedNewPassword);
                }
                throw new BadRequestException(badRequestPasswordStrength);
            }
            throw new BadRequestException(badRequestOldPassword);
        }
        throw new BadRequestException(badRequestNoUser);
    }

    @RequestMapping(value = "/resetPassword", method = RequestMethod.POST)
    public @ResponseBody
    String resetPassword(@RequestBody UserInformation userInformation) throws BadRequestException {
        User userTemp = userRepository.getByUsername(userInformation.getUsername());
        if (userTemp != null) {
            String companyName = companyRepository.getById(userTemp.getCompanyId()).getName();
            if (companyName != null && userInformation.getCompanyName() != null && companyName.equals(userInformation.getCompanyName().trim())) {
                User user = userRepository.findById(userTemp.getId()).orElse(null);
                String newPassword = Util.randomString(randomStringLength);
                user.setPassword(Util.hashPassword(newPassword));
                if(userRepository.saveAndFlush(user) != null){
                    notification.sendNewPassword(user.getEmail().trim(), newPassword);

                    return "Success";
                }
                throw new BadRequestException(badRequestResetPassword);
            }
            throw new BadRequestException(badRequestNoUser);
        }
        throw new BadRequestException(badRequestNoUser);
    }

    @RequestMapping(value = "/deactivate/{id}", method = RequestMethod.GET)
    public @ResponseBody
    String deactivate(@PathVariable Integer id) throws BadRequestException {
        User user = userRepository.findById(id).orElse(null);
        if(user != null && userBean.getUser().getRoleId().equals(superAdmin) && !user.getRoleId().equals(superAdmin)){
            user.setActive((byte)0);
            if(userRepository.saveAndFlush(user) != null){
                return "Success";
            }
            throw new BadRequestException(badRequestDeactivateUser);
        }
        throw new BadRequestException(badRequestNoUser);
    }

    @SuppressWarnings("SameReturnValue")
    @RequestMapping(value = "/registration", method = RequestMethod.POST)
    public @ResponseBody
    String registration(@RequestBody User newUser) throws BadRequestException {
        User userWithUsername = userRepository.getByUsernameAndCompanyId(newUser.getUsername(), newUser.getCompanyId());
        if(userWithUsername == null) {
            if (Validator.stringMaxLength(newUser.getUsername(), 128)) {
                if(Validator.passwordChecking(newUser.getPassword())){
                    if (Validator.stringMaxLength(newUser.getFirstName(), 128)) {
                        if (Validator.stringMaxLength(newUser.getLastName(), 128)) {
                            if(Validator.binaryMaxLength(newUser.getPhoto(), longblobLength)){
                                User user = entityManager.find(User.class, newUser.getId());
                                user.setUsername(newUser.getUsername());
                                user.setPassword(Util.hashPassword(newUser.getPassword()));
                                user.setToken(null);
                                user.setTokenTime(null);
                                user.setFirstName(newUser.getFirstName());
                                user.setLastName(newUser.getLastName());
                                user.setPhoto(newUser.getPhoto());
                                if(user.getRoleId().equals(Integer.valueOf(3))){
                                    user.setRequest((byte) 1);
                                }
                                else{
                                    user.setActive((byte) 1);
                                }

                                if(userRepository.saveAndFlush(user) != null){
                                    return "Success";
                                }
                                throw new BadRequestException(badRequestRegistration);
                            }
                            throw new BadRequestException(badRequestBinaryLength.replace("{tekst}", "slike"));
                        }
                        throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "prezimena").replace("{broj}", String.valueOf(128)));
                    }
                    throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "imena").replace("{broj}", String.valueOf(128)));
                }
                throw new BadRequestException(badRequestPasswordStrength);
            }
            throw new BadRequestException(badRequestStringMaxLength.replace("{tekst}", "username-a").replace("{broj}", String.valueOf(128)));
        }
        throw new BadRequestException(badRequestUsernameExists);
    }

    @RequestMapping(value = "/mailStatus/{id}", method = RequestMethod.POST)
    @Transactional
    public @ResponseBody
    String updateMailStatus(@PathVariable Integer id, @RequestParam("status") Integer statusId) throws BadRequestException {
        User user = userRepository.findById(id).orElse(null);
        if(userBean.getUser().getId().equals(id) && user != null){
            User oldObject = user;
            user.setMailStatusId(statusId);
            if (userRepository.saveAndFlush(user) != null) {
                logUpdateAction(user, oldObject);
                return "Success";
            }
            else{
                throw new BadRequestException(badRequestUpdate);
            }
        }
        else{
            throw new BadRequestException(badRequestNoUser);
        }
    }

    @RequestMapping(value = {"/state"}, method = RequestMethod.GET)
    public @ResponseBody
    User checkState() throws ForbiddenException {
        System.out.println("LOGGED" + userBean.getLoggedIn() + " user:" + userBean.getUser().getUsername());
        if (userBean.getLoggedIn()) {
            return userBean.getUser();
        } else
            throw new ForbiddenException("Forbidden");
    }
}
