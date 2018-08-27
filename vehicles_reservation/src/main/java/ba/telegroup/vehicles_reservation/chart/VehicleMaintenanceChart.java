package ba.telegroup.vehicles_reservation.chart;

public class VehicleMaintenanceChart {

    private Double serviceCost;
    private Double fuelCost;
    private Double otherCost;
    private String timeUnit;

    public VehicleMaintenanceChart() {
        this.serviceCost = 0.0;
        this.fuelCost = 0.0;
        this.otherCost = 0.0;
    }

    public VehicleMaintenanceChart(Double serviceCost, Double fuelCost, Double otherCost, String timeUnit) {
        this.serviceCost = serviceCost;
        this.fuelCost = fuelCost;
        this.otherCost = otherCost;
        this.timeUnit = timeUnit;
    }

    public Double getServiceCost() {
        return serviceCost;
    }

    public void setServiceCost(Double serviceCost) {
        this.serviceCost = serviceCost;
    }

    public Double getFuelCost() {
        return fuelCost;
    }

    public void setFuelCost(Double fuelCost) {
        this.fuelCost = fuelCost;
    }

    public Double getOtherCost() {
        return otherCost;
    }

    public void setOtherCost(Double otherCost) {
        this.otherCost = otherCost;
    }

    public String getTimeUnit() {
        return timeUnit;
    }

    public void setTimeUnit(String timeUnit) {
        this.timeUnit = timeUnit;
    }
}
