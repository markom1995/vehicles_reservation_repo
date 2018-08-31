package ba.telegroup.vehicles_reservation.controller;

import ba.telegroup.vehicles_reservation.chart.VehicleMaintenanceChart;
import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.controller.genericController.GenericHasCompanyIdAndDeletableController;
import ba.telegroup.vehicles_reservation.model.VehicleMaintenance;
import ba.telegroup.vehicles_reservation.repository.VehicleMaintenanceRepository;
import ba.telegroup.vehicles_reservation.util.FileInformation;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.sql.Date;
import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.IsoFields;
import java.time.temporal.WeekFields;
import java.util.*;

@RequestMapping(value = "/hub/vehicleMaintenance")
@Controller
@Scope("request")
public class VehicleMaintenanceController extends GenericHasCompanyIdAndDeletableController<VehicleMaintenance, Integer> {

    private final VehicleMaintenanceRepository vehicleMaintenanceRepository;
    private final JdbcTemplate jdbcTemplate;

    @Value("${badRequest.noVehicleMaintenance}")
    private String badRequestVehicleMaintenance;

    @Value("${badRequest.badFileFormat}")
    private String badRequestBadFileFormat;

    @Value("${badRequest.problemWithDownloadFile}")
    private String badRequestProblemWithDownloadFile;

    @Autowired
    public VehicleMaintenanceController(VehicleMaintenanceRepository vehicleMaintenanceRepository, JdbcTemplate jdbcTemplate){
        super(vehicleMaintenanceRepository);
        this.vehicleMaintenanceRepository = vehicleMaintenanceRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    @Transactional
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List getAll(){
        return vehicleMaintenanceRepository.getAllExtendedByCompanyIdAndDeleted(userBean.getUser().getCompanyId(), (byte)0);
    }

    @Transactional
    @RequestMapping(value = "/custom/{vehicleId}", method = RequestMethod.GET)
    public @ResponseBody
    List getAllExtendedByVehicleId(@PathVariable Integer vehicleId) {
        return vehicleMaintenanceRepository.getAllExtendedByCompanyIdAndDeletedAndVehicleId(userBean.getUser().getCompanyId(), (byte)0, vehicleId);
    }

    @RequestMapping(value = "/chart/year", method = RequestMethod.POST)
    public @ResponseBody
    List<VehicleMaintenanceChart> getYearVehicleMaintenanceChart(@RequestParam("startDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate endDate) throws BadRequestException {
        List<VehicleMaintenanceChart> vehicleMaintenancesChart = new ArrayList<>();
        List<VehicleMaintenance> vehicleMaintenances = vehicleMaintenanceRepository.getAllByCompanyIdAndDeleted(userBean.getUser().getCompanyId(), (byte)0);

        if(vehicleMaintenances != null && !vehicleMaintenances.isEmpty()){
            for(int i = startDate.getYear() ; i <= endDate.getYear() ; i++){
                vehicleMaintenancesChart.add(new VehicleMaintenanceChart(0.0, 0.0, 0.0, Integer.toString(i)));
            }

            for(VehicleMaintenance vehicleMaintenance : vehicleMaintenances){
                LocalDate localDate = LocalDate.ofInstant(Instant.ofEpochMilli(vehicleMaintenance.getDate().getTime()), ZoneId.systemDefault());
                if(Integer.valueOf(localDate.getYear()).compareTo(startDate.getYear()) >= 0 && Integer.valueOf(localDate.getYear()).compareTo(endDate.getYear()) <= 0){
                    for(VehicleMaintenanceChart vehicleMaintenanceChart : vehicleMaintenancesChart){
                        if(Integer.valueOf(localDate.getYear()).equals(Integer.valueOf(vehicleMaintenanceChart.getTimeUnit()))){
                            if(vehicleMaintenance.getVehicleMaintenanceTypeId().equals(Integer.valueOf(1))){
                                vehicleMaintenanceChart.setServiceCost(vehicleMaintenanceChart.getServiceCost() + vehicleMaintenance.getPrice());
                            }
                            else if(vehicleMaintenance.getVehicleMaintenanceTypeId().equals(Integer.valueOf(2))){
                                vehicleMaintenanceChart.setFuelCost(vehicleMaintenanceChart.getFuelCost() + vehicleMaintenance.getPrice());
                            }
                            else{
                                vehicleMaintenanceChart.setOtherCost(vehicleMaintenanceChart.getOtherCost() + vehicleMaintenance.getPrice());
                            }
                        }
                    }
                }
            }

            return vehicleMaintenancesChart;
        }
        else{
            throw new BadRequestException(badRequestVehicleMaintenance);
        }
    }

    @RequestMapping(value = "/chart/month", method = RequestMethod.POST)
    public @ResponseBody
    List<VehicleMaintenanceChart> getMonthVehicleMaintenanceChart(@RequestParam("startDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate endDate) throws BadRequestException {
        List<VehicleMaintenanceChart> vehicleMaintenancesChart = new ArrayList<>();
        List<VehicleMaintenance> vehicleMaintenances = vehicleMaintenanceRepository.getAllByCompanyIdAndDeleted(userBean.getUser().getCompanyId(), (byte)0);

        if(vehicleMaintenances != null && !vehicleMaintenances.isEmpty()){
            if(startDate.getYear() == endDate.getYear()){
                for(int i= startDate.getMonthValue() ; i <= endDate.getMonthValue() ; i++){
                    vehicleMaintenancesChart.add(new VehicleMaintenanceChart(0.0, 0.0, 0.0, Integer.toString(i) + "/" + Integer.toString(startDate.getYear())));
                }
            }
            else{
                for(int i = startDate.getYear() ; i <= endDate.getYear() ; i++){
                    if(i == startDate.getYear()) {
                        for(int j = startDate.getMonthValue() ; j <= 12 ; j++){
                            vehicleMaintenancesChart.add(new VehicleMaintenanceChart(0.0, 0.0, 0.0, Integer.toString(j) + "/" + Integer.toString(i)));
                        }
                    }
                    else if(i == endDate.getYear()){
                        for(int j = 1 ; j <= endDate.getMonthValue() ; j++){
                            vehicleMaintenancesChart.add(new VehicleMaintenanceChart(0.0, 0.0, 0.0, Integer.toString(j) + "/" + Integer.toString(i)));
                        }
                    }
                    else{
                        for(int j = 1 ; j <= 12 ; j++){
                            vehicleMaintenancesChart.add(new VehicleMaintenanceChart(0.0, 0.0, 0.0, Integer.toString(j) + "/" + Integer.toString(i)));
                        }
                    }
                }
            }

            for(VehicleMaintenance vehicleMaintenance : vehicleMaintenances){
                LocalDate localDate = LocalDate.ofInstant(Instant.ofEpochMilli(vehicleMaintenance.getDate().getTime()), ZoneId.systemDefault());
                if((Integer.valueOf(localDate.getYear()).compareTo(startDate.getYear()) > 0 && Integer.valueOf(localDate.getYear()).compareTo(endDate.getYear()) < 0) ||
                        (Integer.valueOf(localDate.getYear()).compareTo(startDate.getYear()) == 0 && Integer.valueOf(localDate.getMonthValue()).compareTo(startDate.getMonthValue()) >= 0) ||
                        (Integer.valueOf(localDate.getYear()).compareTo(endDate.getYear()) == 0 && Integer.valueOf(localDate.getMonthValue()).compareTo(endDate.getMonthValue()) <= 0)){
                    for(VehicleMaintenanceChart vehicleMaintenanceChart : vehicleMaintenancesChart){
                        if(Integer.valueOf(localDate.getYear()).equals(Integer.valueOf(vehicleMaintenanceChart.getTimeUnit().split("\\/")[1])) && Integer.valueOf(localDate.getMonthValue()).equals(Integer.valueOf(vehicleMaintenanceChart.getTimeUnit().split("\\/")[0]))){
                            if(vehicleMaintenance.getVehicleMaintenanceTypeId().equals(Integer.valueOf(1))){
                                vehicleMaintenanceChart.setServiceCost(vehicleMaintenanceChart.getServiceCost() + vehicleMaintenance.getPrice());
                            }
                            else if(vehicleMaintenance.getVehicleMaintenanceTypeId().equals(Integer.valueOf(2))){
                                vehicleMaintenanceChart.setFuelCost(vehicleMaintenanceChart.getFuelCost() + vehicleMaintenance.getPrice());
                            }
                            else{
                                vehicleMaintenanceChart.setOtherCost(vehicleMaintenanceChart.getOtherCost() + vehicleMaintenance.getPrice());
                            }
                        }
                    }
                }
            }

            return vehicleMaintenancesChart;
        }
        else{
            throw new BadRequestException(badRequestVehicleMaintenance);
        }
    }

    @RequestMapping(value = "/chart/week", method = RequestMethod.POST)
    public @ResponseBody
    List<VehicleMaintenanceChart> getWeekVehicleMaintenanceChart(@RequestParam("startDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate endDate) throws BadRequestException {
        List<VehicleMaintenanceChart> vehicleMaintenancesChart = new ArrayList<>();
        List<VehicleMaintenance> vehicleMaintenances = vehicleMaintenanceRepository.getAllByCompanyIdAndDeleted(userBean.getUser().getCompanyId(), (byte)0);
        WeekFields weekFields = WeekFields.of(Locale.FRANCE);

        System.out.println(startDate.get(weekFields.weekOfWeekBasedYear()));

        if(vehicleMaintenances != null && !vehicleMaintenances.isEmpty()){
            if(startDate.getYear() == endDate.getYear()){
                for(int i = startDate.get(weekFields.weekOfWeekBasedYear()) ; i <= endDate.get(weekFields.weekOfWeekBasedYear()) ; i++){
                    vehicleMaintenancesChart.add(new VehicleMaintenanceChart(0.0, 0.0, 0.0, Integer.toString(i) + "/" + Integer.toString(startDate.getYear())));
                }
            }
            else{
                for(int i = startDate.getYear() ; i <= endDate.getYear() ; i++){
                    if(i == startDate.getYear()) {
                        for(int j = startDate.get(weekFields.weekOfWeekBasedYear()) ; j <= IsoFields.WEEK_OF_WEEK_BASED_YEAR.rangeRefinedBy(LocalDate.of(i, 1, 1)).getMaximum() ; j++){
                            vehicleMaintenancesChart.add(new VehicleMaintenanceChart(0.0, 0.0, 0.0, Integer.toString(j) + "/" + Integer.toString(i)));
                        }
                    }
                    else if(i == endDate.getYear()){
                        for(int j = 1 ; j <= endDate.get(weekFields.weekOfWeekBasedYear()) ; j++){
                            vehicleMaintenancesChart.add(new VehicleMaintenanceChart(0.0, 0.0, 0.0, Integer.toString(j) + "/" + Integer.toString(i)));
                        }
                    }
                    else{
                        for(int j = 1 ; j <= IsoFields.WEEK_OF_WEEK_BASED_YEAR.rangeRefinedBy(LocalDate.of(i, 1, 1)).getMaximum() ; j++){
                            vehicleMaintenancesChart.add(new VehicleMaintenanceChart(0.0, 0.0, 0.0, Integer.toString(j) + "/" + Integer.toString(i)));
                        }
                    }
                }
            }

            for(VehicleMaintenance vehicleMaintenance : vehicleMaintenances){
                LocalDate localDate = LocalDate.ofInstant(Instant.ofEpochMilli(vehicleMaintenance.getDate().getTime()), ZoneId.systemDefault());
                if((Integer.valueOf(localDate.getYear()).compareTo(startDate.getYear()) > 0 && Integer.valueOf(localDate.getYear()).compareTo(endDate.getYear()) < 0) ||
                        (Integer.valueOf(localDate.getYear()).compareTo(startDate.getYear()) == 0 && Integer.valueOf(localDate.get(weekFields.weekOfWeekBasedYear())).compareTo(Integer.valueOf(startDate.get(weekFields.weekOfWeekBasedYear()))) >= 0) ||
                        (Integer.valueOf(localDate.getYear()).compareTo(endDate.getYear()) == 0 && Integer.valueOf(localDate.get(weekFields.weekOfWeekBasedYear())).compareTo(endDate.get(weekFields.weekOfWeekBasedYear())) <= 0)){
                    for(VehicleMaintenanceChart vehicleMaintenanceChart : vehicleMaintenancesChart){
                        if(Integer.valueOf(localDate.getYear()).equals(Integer.valueOf(vehicleMaintenanceChart.getTimeUnit().split("\\/")[1])) && Integer.valueOf(localDate.get(weekFields.weekOfWeekBasedYear())).equals(Integer.valueOf(vehicleMaintenanceChart.getTimeUnit().split("\\/")[0]))){
                            if(vehicleMaintenance.getVehicleMaintenanceTypeId().equals(Integer.valueOf(1))){
                                vehicleMaintenanceChart.setServiceCost(vehicleMaintenanceChart.getServiceCost() + vehicleMaintenance.getPrice());
                            }
                            else if(vehicleMaintenance.getVehicleMaintenanceTypeId().equals(Integer.valueOf(2))){
                                vehicleMaintenanceChart.setFuelCost(vehicleMaintenanceChart.getFuelCost() + vehicleMaintenance.getPrice());
                            }
                            else{
                                vehicleMaintenanceChart.setOtherCost(vehicleMaintenanceChart.getOtherCost() + vehicleMaintenance.getPrice());
                            }
                        }
                    }
                }
            }

            return vehicleMaintenancesChart;
        }
        else{
            throw new BadRequestException(badRequestVehicleMaintenance);
        }
    }

    @RequestMapping(value = "/report/all/month", method = RequestMethod.POST)
    public @ResponseBody
    FileInformation getMonthVehicleMaintenanceReport(@RequestParam("startDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate endDate, @RequestParam("format") String format) throws BadRequestException {
        try {
            HashMap parameters = new HashMap();
            parameters.put("TitleDetails", "Za period " + startDate + " - " + endDate);
            parameters.put("StartDate", Date.valueOf(startDate));
            parameters.put("EndDate", Date.valueOf(endDate));
            parameters.put("CompanyId", userBean.getUser().getCompanyId());

            JasperPrint jasperPrint = JasperFillManager.fillReport(getClass().getResource("/reports/Vehicle_Maintenance_All.jasper").getPath(), parameters, jdbcTemplate.getDataSource().getConnection());
            String fileName = "";
            if("PDF".equals(format)){
                fileName = "Izvjestaj_" + startDate + "_" + endDate + ".pdf";
                pdfExporterJR(jasperPrint, fileName);
            }
            else if("XLS".equals(format)){
                fileName = "Izvjestaj_" + startDate + "_" + endDate + ".xls";
                xlsExporterJR(jasperPrint, fileName);
            }
            else if("CSV".equals(format)){
                fileName = "Izvjestaj_" + startDate + "_" + endDate + ".csv";
                csvExporterJR(jasperPrint, fileName);
            }
            else{
                throw new BadRequestException(badRequestBadFileFormat);
            }

            FileInformation fileInformation = new FileInformation();
            fileInformation.setName(fileName);
            fileInformation.setContent(Files.readAllBytes(new File(fileName).toPath()));
            Files.delete(new File(fileName).toPath());

            return fileInformation;
        } catch (JRException e) {
            e.printStackTrace();
            throw new BadRequestException(badRequestProblemWithDownloadFile);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new BadRequestException(badRequestProblemWithDownloadFile);
        } catch (IOException e) {
            e.printStackTrace();
            throw new BadRequestException(badRequestProblemWithDownloadFile);
        }
    }

    @RequestMapping(value = "/report/vehicle/month", method = RequestMethod.POST)
    public @ResponseBody
    FileInformation getMonthVehicleMaintenanceReport(@RequestParam("startDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate startDate, @RequestParam("endDate") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate endDate, @RequestParam("format") String format, @RequestParam("vehicleId") Integer vehicleId) throws BadRequestException {
        try {
            HashMap parameters = new HashMap();
            parameters.put("TitleDetails", "Za period " + startDate + " - " + endDate);
            parameters.put("StartDate", Date.valueOf(startDate));
            parameters.put("EndDate", Date.valueOf(endDate));
            parameters.put("CompanyId", userBean.getUser().getCompanyId());
            parameters.put("VehicleId", vehicleId);

            JasperPrint jasperPrint = JasperFillManager.fillReport(getClass().getResource("/reports/Vehicle_Maintenance_One_Vehicle.jasper").getPath(), parameters, jdbcTemplate.getDataSource().getConnection());
            String fileName = "";
            if("PDF".equals(format)){
                fileName = "Izvjestaj_" + startDate + "_" + endDate + ".pdf";
                pdfExporterJR(jasperPrint, fileName);
            }
            else if("XLS".equals(format)){
                fileName = "Izvjestaj_" + startDate + "_" + endDate + ".xls";
                xlsExporterJR(jasperPrint, fileName);
            }
            else if("CSV".equals(format)){
                fileName = "Izvjestaj_" + startDate + "_" + endDate + ".csv";
                csvExporterJR(jasperPrint, fileName);
            }
            else{
                throw new BadRequestException(badRequestBadFileFormat);
            }

            FileInformation fileInformation = new FileInformation();
            fileInformation.setName(fileName);
            fileInformation.setContent(Files.readAllBytes(new File(fileName).toPath()));
            Files.delete(new File(fileName).toPath());

            return fileInformation;
        } catch (JRException e) {
            e.printStackTrace();
            throw new BadRequestException(badRequestProblemWithDownloadFile);
        } catch (SQLException e) {
            e.printStackTrace();
            throw new BadRequestException(badRequestProblemWithDownloadFile);
        } catch (IOException e) {
            e.printStackTrace();
            throw new BadRequestException(badRequestProblemWithDownloadFile);
        }
    }

    private void pdfExporterJR(JasperPrint jasperPrint, String fileName){
        try {
            JRPdfExporter exporter = new JRPdfExporter();

            exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(fileName));

            SimplePdfReportConfiguration reportConfig = new SimplePdfReportConfiguration();
            reportConfig.setSizePageToContent(true);
            reportConfig.setForceLineBreakPolicy(false);

            SimplePdfExporterConfiguration exportConfig = new SimplePdfExporterConfiguration();
            exportConfig.setMetadataAuthor(userBean.getUser().getUsername());
            exportConfig.setEncrypted(true);
            exportConfig.setAllowedPermissionsHint("PRINTING");

            exporter.setConfiguration(reportConfig);
            exporter.setConfiguration(exportConfig);

            exporter.exportReport();
        } catch (JRException e) {
            e.printStackTrace();
        }
    }

    private void xlsExporterJR(JasperPrint jasperPrint, String fileName){
        try {
            JRXlsxExporter exporter = new JRXlsxExporter();

            exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(fileName));

            SimpleXlsxReportConfiguration reportConfig = new SimpleXlsxReportConfiguration();
            reportConfig.setSheetNames(new String[] {"Troškovi održavanja vozila"});

            exporter.setConfiguration(reportConfig);
            exporter.exportReport();
        } catch (JRException e) {
            e.printStackTrace();
        }
    }

    private void csvExporterJR(JasperPrint jasperPrint, String fileName){
        try {
            JRCsvExporter exporter = new JRCsvExporter();

            exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
            exporter.setExporterOutput(new SimpleWriterExporterOutput(fileName));

            exporter.exportReport();
        } catch (JRException e) {
            e.printStackTrace();
        }
    }
}
