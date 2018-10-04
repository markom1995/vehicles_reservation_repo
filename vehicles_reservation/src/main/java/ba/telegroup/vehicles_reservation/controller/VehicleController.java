package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericHasCompanyIdAndDeletableController;
import ba.telegroup.vehicles_reservation.model.Reservation;
import ba.telegroup.vehicles_reservation.model.Vehicle;
import ba.telegroup.vehicles_reservation.model.VehicleManufacturer;
import ba.telegroup.vehicles_reservation.model.VehicleModel;
import ba.telegroup.vehicles_reservation.model.modelCustom.VehicleLocationVehicleModelVehicleManufacturer;
import ba.telegroup.vehicles_reservation.repository.ReservationRepository;
import ba.telegroup.vehicles_reservation.repository.VehicleManufacturerRepository;
import ba.telegroup.vehicles_reservation.repository.VehicleModelRepository;
import ba.telegroup.vehicles_reservation.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.util.List;

@RequestMapping(value = "/hub/vehicle")
@Controller
@Scope("request")
public class VehicleController extends GenericHasCompanyIdAndDeletableController<Vehicle, Integer> {

    private final VehicleRepository vehicleRepository;
    private final VehicleManufacturerRepository vehicleManufacturerRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationController reservationController;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${badRequest.insert}")
    private String badRequestInsert;

    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.noVehicle}")
    private String badRequestNoVehicle;

    @Autowired
    public VehicleController(VehicleRepository vehicleRepository, VehicleManufacturerRepository vehicleManufacturerRepository, VehicleModelRepository vehicleModelRepository, ReservationRepository reservationRepository, ReservationController reservationController){
        super(vehicleRepository);
        this.vehicleRepository = vehicleRepository;
        this.vehicleManufacturerRepository = vehicleManufacturerRepository;
        this.vehicleModelRepository = vehicleModelRepository;
        this.reservationRepository = reservationRepository;
        this.reservationController = reservationController;
    }

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll(){
        return vehicleRepository.getAllExtendedByCompanyIdAndDeleted(userBean.getUser().getCompanyId(), (byte)0);
    }

    @Override
    @Transactional
    @RequestMapping(value = {"/{id}"}, method = RequestMethod.DELETE)
    public @ResponseBody
    String delete(@PathVariable Integer id) throws BadRequestException{
        Vehicle vehicle = vehicleRepository.findById(id).orElse(null);
        if(vehicle != null){
            List<Reservation> reservations = reservationRepository.getAllByCompanyIdAndVehicleIdAndReservationStatusId(userBean.getUser().getCompanyId(), id, Integer.valueOf(1));
            if(reservations != null && !reservations.isEmpty()){
                for(Reservation reservation : reservations){
                    reservationController.delete(reservation.getId());
                }
            }
            vehicle.setDeleted((byte) 1);
            logDeleteAction(vehicle);

            return "Success";
        }
        throw new BadRequestException(badRequestNoVehicle);
    }

    @Transactional
    @RequestMapping(value = "/custom/reservation/{startTime}/{endTime}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedFreeByStartTimeAndEndTime(@PathVariable Timestamp startTime, @PathVariable Timestamp endTime){
        return vehicleRepository.getAllExtendedFreeByCompanyIdAndDeletedAndStartTimeAndEndTime(userBean.getUser().getCompanyId(), (byte)0, startTime, endTime);
    }

    @Transactional
    @RequestMapping(value = "/custom/{locationId}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedByLocationId(@PathVariable Integer locationId){
        return vehicleRepository.getAllExtendedByCompanyIdAndDeletedAndLocationId(userBean.getUser().getCompanyId(), (byte)0, locationId);
    }

    @Transactional
    @RequestMapping(value = "/custom", method = RequestMethod.POST)
    public @ResponseBody
    VehicleLocationVehicleModelVehicleManufacturer insertExtended(@RequestBody VehicleLocationVehicleModelVehicleManufacturer vehicleLocationVehicleModelVehicleManufacturer) throws BadRequestException{
        VehicleModel vehicleModel = getVehicleModel(vehicleLocationVehicleModelVehicleManufacturer);

        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate(vehicleLocationVehicleModelVehicleManufacturer.getLicensePlate());
        vehicle.setVehicleModelId(vehicleModel.getId());
        vehicle.setYear(vehicleLocationVehicleModelVehicleManufacturer.getYear());
        vehicle.setEngine(vehicleLocationVehicleModelVehicleManufacturer.getEngine());
        vehicle.setFuel(vehicleLocationVehicleModelVehicleManufacturer.getFuel());
        vehicle.setPhoto(vehicleLocationVehicleModelVehicleManufacturer.getPhoto());
        vehicle.setDeleted((byte)0);
        vehicle.setLocationId(vehicleLocationVehicleModelVehicleManufacturer.getLocationId());
        vehicle.setCompanyId(userBean.getUser().getCompanyId());

        if(vehicleRepository.saveAndFlush(vehicle) != null){
            entityManager.refresh(vehicle);
            logCreateAction(vehicle);

            vehicleLocationVehicleModelVehicleManufacturer.setId(vehicle.getId());
            vehicleLocationVehicleModelVehicleManufacturer.setVehicleModelId(vehicleModel.getId());

            return vehicleLocationVehicleModelVehicleManufacturer;
        }
        else{
            throw new BadRequestException(badRequestInsert);
        }
    }

    @Transactional
    @RequestMapping(value = "/custom/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    String updateExtended(@PathVariable Integer id, @RequestBody VehicleLocationVehicleModelVehicleManufacturer vehicleLocationVehicleModelVehicleManufacturer) throws BadRequestException{
        VehicleModel vehicleModel = getVehicleModel(vehicleLocationVehicleModelVehicleManufacturer);

        Vehicle vehicle = vehicleRepository.findById(id).orElse(null);
        if(vehicle != null){
            Vehicle oldObject = vehicle;
            vehicle.setLicensePlate(vehicleLocationVehicleModelVehicleManufacturer.getLicensePlate());
            vehicle.setVehicleModelId(vehicleModel.getId());
            vehicle.setYear(vehicleLocationVehicleModelVehicleManufacturer.getYear());
            vehicle.setEngine(vehicleLocationVehicleModelVehicleManufacturer.getEngine());
            vehicle.setFuel(vehicleLocationVehicleModelVehicleManufacturer.getFuel());
            vehicle.setPhoto(vehicleLocationVehicleModelVehicleManufacturer.getPhoto());
            vehicle.setDeleted((byte)0);
            vehicle.setLocationId(vehicleLocationVehicleModelVehicleManufacturer.getLocationId());
            vehicle.setCompanyId(userBean.getUser().getCompanyId());

            if (vehicleRepository.saveAndFlush(vehicle) != null) {
                logUpdateAction(vehicle, oldObject);
                return "Success";
            }
            else{
                throw new BadRequestException(badRequestUpdate);
            }
        }
        else{
            throw new BadRequestException(badRequestNoVehicle);
        }
    }

    VehicleManufacturer getVehicleManufacturer(VehicleLocationVehicleModelVehicleManufacturer vehicleLocationVehicleModelVehicleManufacturer){
        VehicleManufacturer vehicleManufacturer = vehicleManufacturerRepository.getByCompanyIdAndName(userBean.getUser().getCompanyId(), vehicleLocationVehicleModelVehicleManufacturer.getManufacturerName());

        if(vehicleManufacturer == null){
            vehicleManufacturer = new VehicleManufacturer();
            vehicleManufacturer.setName(vehicleLocationVehicleModelVehicleManufacturer.getManufacturerName());
            vehicleManufacturer.setCompanyId(userBean.getUser().getCompanyId());
            if(vehicleManufacturerRepository.saveAndFlush(vehicleManufacturer) != null){
                entityManager.refresh(vehicleManufacturer);
                logSpecificAction("create", "Kreiran je novi entitet: " + vehicleManufacturer, "VehicleManufacturer");
            }
        }

        return vehicleManufacturer;
    }

    VehicleModel getVehicleModel(VehicleLocationVehicleModelVehicleManufacturer vehicleLocationVehicleModelVehicleManufacturer){
        VehicleManufacturer vehicleManufacturer = getVehicleManufacturer(vehicleLocationVehicleModelVehicleManufacturer);
        VehicleModel vehicleModel = vehicleModelRepository.getByVehicleManufacturerIdAndName(vehicleManufacturer.getId(), vehicleLocationVehicleModelVehicleManufacturer.getModelName());

        if(vehicleModel == null){
            vehicleModel = new VehicleModel();
            vehicleModel.setVehicleManufacturerId(vehicleManufacturer.getId());
            vehicleModel.setName(vehicleLocationVehicleModelVehicleManufacturer.getModelName());
            if(vehicleModelRepository.saveAndFlush(vehicleModel) != null){
                entityManager.refresh(vehicleModel);
                logSpecificAction("create", "Kreiran je novi entitet: " + vehicleModel, "VehicleModel");
            }
        }

        return vehicleModel;
    }
}
