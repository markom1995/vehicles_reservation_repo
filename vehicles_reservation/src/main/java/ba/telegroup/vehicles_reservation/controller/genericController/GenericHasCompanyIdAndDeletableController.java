package ba.telegroup.vehicles_reservation.controller.genericController;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.common.exceptions.ForbiddenException;
import ba.telegroup.vehicles_reservation.common.interfaces.Deletable;
import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyId;
import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyIdAndDeletableRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.Serializable;
import java.util.List;

public class GenericHasCompanyIdAndDeletableController<T extends HasCompanyId & Deletable, ID extends Serializable> extends GenericController<T, ID> {

    private HasCompanyIdAndDeletableRepository repo;
    @Value("${role.system_admin}")
    private Integer roleSystemAdministrator;
    @Value("${badRequest.update}")
    private String badRequestUpdate;

    @Value("${badRequest.delete}")
    private String badRequestDelete;


    public GenericHasCompanyIdAndDeletableController(JpaRepository<T, ID> repo) {
        super(repo);
        if (repo instanceof HasCompanyIdAndDeletableRepository)
            this.repo = (HasCompanyIdAndDeletableRepository) repo;
        else
            throw new RuntimeException("Repository must implement " + HasCompanyIdAndDeletableRepository.class.getSimpleName());
    }

    @Override
    public List<T> getAll() throws ForbiddenException {
        return userBean.getUser().getRoleId().equals(roleSystemAdministrator) ? repo.getAllByDeletedIs((byte) 0) :
                repo.getAllByCompanyIdAndDeletedIs(userBean.getUser().getCompanyId(), (byte) 0);
    }

    @Override
    public T findById(@PathVariable ID id) throws ForbiddenException {
        T object = super.findById(id);
        if (object == null || object.getDeleted().equals((byte) 1) || (!userBean.getUser().getRoleId().equals(roleSystemAdministrator) && !userBean.getUser().getCompanyId().equals(object.getCompanyId())))
            object = null;
        return object;
    }

    @Override
    public String update(@PathVariable ID id, @RequestBody T object) throws BadRequestException, ForbiddenException {
        if (findById(id) == null)
            throw new BadRequestException(badRequestUpdate);
        return super.update(id, object);
    }

    @Override
    public String delete(@PathVariable ID id) throws BadRequestException, ForbiddenException {
        T object = findById(id);
        if (object != null) {
            object.setDeleted((byte) 1);
            logDeleteAction(object);
            return "Success";
        } else {
            throw new BadRequestException(badRequestDelete);
        }
    }
}
