package ba.telegroup.vehicles_reservation.model;

import ba.telegroup.vehicles_reservation.common.interfaces.Deletable;
import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyId;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;

@SqlResultSetMapping(
        name = "UserMapping",
        classes = @ConstructorResult(
                targetClass = User.class,
                columns = {
                        @ColumnResult(name="id"),
                        @ColumnResult(name="email"),
                        @ColumnResult(name="username"),
                        @ColumnResult(name="password"),
                        @ColumnResult(name="first_name"),
                        @ColumnResult(name="last_name"),
                        @ColumnResult(name="photo"),
                        @ColumnResult(name="active"),
                        @ColumnResult(name="deleted"),
                        @ColumnResult(name="request"),
                        @ColumnResult(name="token"),
                        @ColumnResult(name="token_time", type = Date.class),
                        @ColumnResult(name="mail_status_id"),
                        @ColumnResult(name="location_id"),
                        @ColumnResult(name="company_id"),
                        @ColumnResult(name="role_id")
                }
        )
)
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class User implements Deletable, HasCompanyId {
    private Integer id;
    private String email;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private byte[] photo;
    private Byte active;
    private Byte deleted;
    private Byte request;
    private String token;
    private Timestamp tokenTime;
    private Integer mailStatusId;
    private Integer locationId;
    private Integer companyId;
    private Integer roleId;

    public User() {}
    public User(Integer id, String email, String username, String password, String first_name, String last_name, byte[] photo, Byte active, Byte deleted, Byte request, String token, Date token_time, Integer mailStatusId, Integer locationId, Integer company_id, Integer role_id) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.firstName = first_name;
        this.lastName = last_name;
        this.photo = photo;
        this.active = active;
        this.deleted = deleted;
        this.request = request;
        this.token = token;
        setTokenTime(token_time==null ? null:new Timestamp(token_time.getTime()));
        this.mailStatusId = mailStatusId;
        this.locationId = locationId;
        this.companyId = company_id;
        this.roleId = role_id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Basic
    @Column(name = "email", nullable = false, length = 128)
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Basic
    @Column(name = "username", nullable = true, length = 128)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Basic
    @Column(name = "password", nullable = true, length = 128)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Basic
    @Column(name = "first_name", nullable = true, length = 128)
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @Basic
    @Column(name = "last_name", nullable = true, length = 128)
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @Basic
    @Column(name = "photo", nullable = true)
    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    @Basic
    @Column(name = "active", nullable = false)
    public Byte getActive() {
        return active;
    }

    public void setActive(Byte active) {
        this.active = active;
    }

    @Basic
    @Column(name = "deleted", nullable = false)
    public Byte getDeleted() {
        return deleted;
    }

    public void setDeleted(Byte deleted) {
        this.deleted = deleted;
    }

    @Basic
    @Column(name = "request", nullable = false)
    public Byte getRequest() {
        return request;
    }

    public void setRequest(Byte request) {
        this.request = request;
    }

    @Basic
    @Column(name = "token", nullable = true, length = 16)
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Basic
    @Column(name = "token_time", nullable = true)
    public Timestamp getTokenTime() {
        return tokenTime;
    }

    public void setTokenTime(Timestamp tokenTime) {
        this.tokenTime = tokenTime;
    }

    @Basic
    @Column(name = "mail_status_id", nullable = true)
    public Integer getMailStatusId() {
        return mailStatusId;
    }

    public void setMailStatusId(Integer mailStatusId) {
        this.mailStatusId = mailStatusId;
    }

    @Basic
    @Column(name = "location_id", nullable = true)
    public Integer getLocationId() {
        return locationId;
    }

    public void setLocationId(Integer locationId) {
        this.locationId = locationId;
    }

    @Basic
    @Column(name = "company_id", nullable = true)
    public Integer getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Integer companyId) {
        this.companyId = companyId;
    }

    @Basic
    @Column(name = "role_id", nullable = false)
    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (id != null ? !id.equals(user.id) : user.id != null) return false;
        if (email != null ? !email.equals(user.email) : user.email != null) return false;
        if (username != null ? !username.equals(user.username) : user.username != null) return false;
        if (password != null ? !password.equals(user.password) : user.password != null) return false;
        if (firstName != null ? !firstName.equals(user.firstName) : user.firstName != null) return false;
        if (lastName != null ? !lastName.equals(user.lastName) : user.lastName != null) return false;
        if (!Arrays.equals(photo, user.photo)) return false;
        if (active != null ? !active.equals(user.active) : user.active != null) return false;
        if (companyId != null ? !companyId.equals(user.companyId) : user.companyId != null) return false;
        if (roleId != null ? !roleId.equals(user.roleId) : user.roleId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (username != null ? username.hashCode() : 0);
        result = 31 * result + (password != null ? password.hashCode() : 0);
        result = 31 * result + (firstName != null ? firstName.hashCode() : 0);
        result = 31 * result + (lastName != null ? lastName.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(photo);
        result = 31 * result + (active != null ? active.hashCode() : 0);
        result = 31 * result + (companyId != null ? companyId.hashCode() : 0);
        result = 31 * result + (roleId != null ? roleId.hashCode() : 0);
        return result;
    }
}
