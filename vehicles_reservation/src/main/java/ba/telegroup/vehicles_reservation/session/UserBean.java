package ba.telegroup.vehicles_reservation.session;

import ba.telegroup.vehicles_reservation.model.User;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("session")
public class UserBean {
    private User user;
    private Boolean loggedIn;

    public UserBean() {
        user = new User();
        loggedIn = false;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Boolean getLoggedIn() {
        return loggedIn;
    }

    public void setLoggedIn(Boolean loggedIn) {
        this.loggedIn = loggedIn;
    }
}
