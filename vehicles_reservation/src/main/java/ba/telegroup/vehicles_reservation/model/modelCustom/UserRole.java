package ba.telegroup.vehicles_reservation.model.modelCustom;

import ba.telegroup.vehicles_reservation.model.User;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "UserRoleMapping",
        classes = @ConstructorResult(
                targetClass = UserRole.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "username"),
                        @ColumnResult(name="first_name"),
                        @ColumnResult(name="last_name"),
                        @ColumnResult(name="role_name")
                }
        )
)
@MappedSuperclass
public class UserRole extends User {

    private String roleName;

    public UserRole(Integer id, String username, String firstName, String lastName, String roleName){
        setId(id);
        setUsername(username);
        setFirstName(firstName);
        setLastName(lastName);
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
