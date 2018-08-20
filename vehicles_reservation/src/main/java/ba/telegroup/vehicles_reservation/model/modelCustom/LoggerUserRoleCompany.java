package ba.telegroup.vehicles_reservation.model.modelCustom;

import ba.telegroup.vehicles_reservation.model.Logger;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.MappedSuperclass;
import javax.persistence.SqlResultSetMapping;
import java.sql.Timestamp;
import java.util.Date;

@SuppressWarnings("WeakerAccess")
@SqlResultSetMapping(
        name = "LoggerUserRoleCompanyMapping",
        classes = @ConstructorResult(
                targetClass = LoggerUserRoleCompany.class,
                columns = {
                        @ColumnResult(name = "id"),
                        @ColumnResult(name = "action_type"),
                        @ColumnResult(name = "action_details"),
                        @ColumnResult(name = "table_name"),
                        @ColumnResult(name = "created"),
                        @ColumnResult(name = "user_id"),
                        @ColumnResult(name = "atomic"),
                        @ColumnResult(name = "company_id"),
                        @ColumnResult(name = "username"),
                        @ColumnResult(name = "role_name"),
                        @ColumnResult(name = "company_name")
                }
        )
)
@MappedSuperclass
public class LoggerUserRoleCompany extends Logger {
    private String username;
    private String roleName;
    private String companyName;

    public LoggerUserRoleCompany(Integer id, String actionType, String actionDetails, String tableName, Date created, Integer userId, Byte atomic, Integer companyId, String username, String roleName, String companyName){
        setId(id);
        setActionType(actionType);
        setActionDetails(actionDetails);
        setTableName(tableName);
        setCreated(new Timestamp(created.getTime()));
        setUserId(userId);
        setAtomic(atomic);
        setCompanyId(companyId);
        this.username = username;
        this.roleName = roleName;
        this.companyName = companyName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
