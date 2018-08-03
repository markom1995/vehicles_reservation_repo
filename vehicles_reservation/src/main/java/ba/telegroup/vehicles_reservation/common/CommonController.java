package ba.telegroup.vehicles_reservation.common;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.common.exceptions.ForbiddenException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

public class CommonController {

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public @ResponseBody
    String handleException(BadRequestException e) {
        return e.getMessage();
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(value = HttpStatus.FORBIDDEN)
    public @ResponseBody
    String handleException(ForbiddenException e) {
        return e.getMessage();
    }
}
