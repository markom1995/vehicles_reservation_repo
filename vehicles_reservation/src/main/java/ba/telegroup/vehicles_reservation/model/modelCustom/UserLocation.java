package ba.telegroup.vehicles_reservation.model.modelCustom;

import ba.telegroup.vehicles_reservation.model.User;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "UserLocationMapping",
        classes = @ConstructorResult(
                targetClass = UserLocation.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "first_name"),
                        @ColumnResult(name = "last_name"),
                        @ColumnResult(name = "email"),
                        @ColumnResult(name = "username"),
                        @ColumnResult(name = "location")
                }
        )
)
@MappedSuperclass
public class UserLocation extends User {

    private String location;

    public UserLocation() {
    }

    public UserLocation(Integer id, String firstName, String lastName, String email, String username, String location) {
        setId(id);
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
        setUsername(username);
        this.location = location;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
