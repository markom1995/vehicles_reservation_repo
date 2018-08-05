package ba.telegroup.vehicles_reservation.model.modelCustom;

import ba.telegroup.vehicles_reservation.model.Company;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;
import java.io.Serializable;
import java.sql.Time;
import java.util.Date;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "CompanyUserMapping",
        classes = @ConstructorResult(
                targetClass = CompanyUser.class,
                columns = {
                        @ColumnResult(name="id"),
                        @ColumnResult(name="name"),
                        @ColumnResult(name="logo"),
                        @ColumnResult(name="email")
                }
        )
)
@MappedSuperclass
public class CompanyUser extends Company implements Serializable {

    private String email;

    public CompanyUser() {
    }

    public CompanyUser(Integer id, String name, byte[] logo, String email) {
        setId(id);
        setName(name);
        setLogo(logo);
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Byte getDeleted() {
        return super.getDeleted();
    }
}
