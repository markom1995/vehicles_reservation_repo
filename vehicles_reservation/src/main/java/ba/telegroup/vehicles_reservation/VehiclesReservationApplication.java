package ba.telegroup.vehicles_reservation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@ServletComponentScan
@EnableConfigurationProperties
@EnableAsync
public class VehiclesReservationApplication {

    public static void main(String[] args) {
        SpringApplication.run(VehiclesReservationApplication.class, args);
    }
}
