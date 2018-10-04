package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.common.exceptions.ForbiddenException;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericHasCompanyIdAndDeletableController;
import ba.telegroup.vehicles_reservation.model.*;
import ba.telegroup.vehicles_reservation.model.modelCustom.VehicleLocationVehicleModelVehicleManufacturer;
import ba.telegroup.vehicles_reservation.repository.*;
import ba.telegroup.vehicles_reservation.util.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@RequestMapping(value = "/hub/reservation")
@Controller
@Scope("request")
public class ReservationController extends GenericHasCompanyIdAndDeletableController<Reservation, Integer> {

    private final ReservationRepository reservationRepository;
    private final VehicleMaintenanceRepository vehicleMaintenanceRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final VehicleRepository vehicleRepository;
    private final Notification notification;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.delete}")
    private String badRequestDelete;

    @Value("${badRequest.noReservation}")
    private String badRequestNoReservation;

    @Autowired
    public ReservationController(ReservationRepository reservationRepository, VehicleMaintenanceRepository vehicleMaintenanceRepository, UserRepository userRepository, LocationRepository locationRepository, VehicleRepository vehicleRepository, Notification notification){
        super(reservationRepository);
        this.reservationRepository = reservationRepository;
        this.vehicleMaintenanceRepository = vehicleMaintenanceRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.vehicleRepository = vehicleRepository;
        this.notification = notification;
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

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public @ResponseBody
    Reservation insert(@RequestBody Reservation reservation) throws BadRequestException {
        Reservation newReservation = null;
        if ((newReservation = reservationRepository.saveAndFlush(reservation)) != null) {
            entityManager.refresh(newReservation);
            logCreateAction(reservation);

            VehicleLocationVehicleModelVehicleManufacturer vehicle = vehicleRepository.getExtendedById(newReservation.getVehicleId());
            if(vehicle != null){
                Location location = locationRepository.findById(vehicle.getLocationId()).orElse(null);
                if(location != null){
                    List<User> usersForNotification = new ArrayList<>();
                    List<User> companyUsersNotification = userRepository.getByCompanyIdAndDeletedAndActiveAndMailStatusId(userBean.getUser().getCompanyId(), (byte)0, (byte)1, 2);
                    List<User> locationUserNotification = userRepository.getByCompanyIdAndDeletedAndActiveAndMailStatusIdAndLocationId(userBean.getUser().getCompanyId(), (byte)0, (byte)1, 1, location.getId());
                    usersForNotification.addAll(companyUsersNotification);
                    usersForNotification.addAll(locationUserNotification);

                    DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                    String vehicleDetails = vehicle.getLicensePlate() + " - " + vehicle.getManufacturerName() + " " + vehicle.getModelName();
                    String time = dateFormat.format(newReservation.getStartTime()) + " - " + dateFormat.format(newReservation.getEndTime());

                    for(User user : usersForNotification){
                        notification.notify(user.getEmail(), vehicleDetails, newReservation.getName(), newReservation.getDirection(), time, true);
                    }

                    return newReservation;
                }
                else{
                    throw new BadRequestException(badRequestInsert);
                }
            }
            else{
                throw new BadRequestException(badRequestInsert);
            }
        }
        throw new BadRequestException(badRequestInsert);
    }

    @Override
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException {
        try {
            Reservation reservation = reservationRepository.findById(id).orElse(null);
            reservation.setDeleted((byte) 1);
            logDeleteAction(reservation);

            VehicleLocationVehicleModelVehicleManufacturer vehicle = vehicleRepository.getExtendedById(reservation.getVehicleId());
            if(vehicle != null){
                Location location = locationRepository.findById(vehicle.getLocationId()).orElse(null);
                if(location != null){
                    List<User> usersForNotification = new ArrayList<>();
                    List<User> companyUsersNotification = userRepository.getByCompanyIdAndDeletedAndActiveAndMailStatusId(userBean.getUser().getCompanyId(), (byte)0, (byte)1, 2);
                    List<User> locationUserNotification = userRepository.getByCompanyIdAndDeletedAndActiveAndMailStatusIdAndLocationId(userBean.getUser().getCompanyId(), (byte)0, (byte)1, 1, location.getId());
                    usersForNotification.addAll(companyUsersNotification);
                    usersForNotification.addAll(locationUserNotification);

                    DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
                    String vehicleDetails = vehicle.getLicensePlate() + " - " + vehicle.getManufacturerName() + " " + vehicle.getModelName();
                    String time = dateFormat.format(reservation.getStartTime()) + " - " + dateFormat.format(reservation.getEndTime());

                    for(User user : usersForNotification){
                        notification.notify(user.getEmail(), vehicleDetails, reservation.getName(), reservation.getDirection(), time, false);
                    }

                    return "Success";
                }
                else{
                    throw new BadRequestException(badRequestDelete);
                }
            }
            else{
                throw new BadRequestException(badRequestDelete);
            }
        } catch (Exception ex) {
            throw new BadRequestException(badRequestDelete);
        }
    }

    @Transactional
    @RequestMapping(value = "/finishTrip/{id}/{endKm}", method = RequestMethod.PUT)
    public @ResponseBody
    String finishTripWithMaintenances(@PathVariable Integer id, @PathVariable Integer endKm, @RequestBody List<VehicleMaintenance> vehicleMaintenances) throws BadRequestException {
        Reservation reservation = reservationRepository.findById(id).orElse(null);
        if(reservation != null){
            Reservation oldObject = reservation;
            reservation.setEndKm(endKm);
            reservation.setReservationStatusId(3);
            if (reservationRepository.saveAndFlush(reservation) != null) {
                logUpdateAction(reservation, oldObject);

                for(VehicleMaintenance vehicleMaintenance : vehicleMaintenances){
                    if(vehicleMaintenanceRepository.saveAndFlush(vehicleMaintenance) != null){
                        entityManager.refresh(vehicleMaintenance);
                        logSpecificAction("create", "Kreiran je novi entitet: " + vehicleMaintenance, "VehicleMaintenance");
                    }
                    else{
                        throw new BadRequestException(badRequestUpdate);
                    }
                }

                return "Success";
            }
            else{
                throw new BadRequestException(badRequestUpdate);
            }
        }
        else{
            throw new BadRequestException(badRequestNoReservation);
        }
    }
}
