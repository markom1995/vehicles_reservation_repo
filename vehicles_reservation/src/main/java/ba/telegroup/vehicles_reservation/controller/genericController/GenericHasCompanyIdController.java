package ba.telegroup.vehicles_reservation.controller.genericController;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import ba.telegroup.vehicles_reservation.common.exceptions.ForbiddenException;
import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyId;
import ba.telegroup.vehicles_reservation.common.interfaces.HasCompanyIdRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.Serializable;
import java.util.List;

public class GenericHasCompanyIdController<T extends HasCompanyId, ID extends Serializable> extends GenericController<T, ID> {

    private HasCompanyIdRepository<T> repo;
    @Value("${role.system_admin}")
    private Integer roleSystemAdministrator;
    @Value("${badRequest.update}")
    private String badRequestUpdate;


    public GenericHasCompanyIdController(JpaRepository<T, ID> repo) {
        super(repo);
        if (repo instanceof HasCompanyIdRepository)
            this.repo = (HasCompanyIdRepository) repo;
        else throw new RuntimeException("Repository must implement " + HasCompanyIdRepository.class.getSimpleName());
    }

    @Override
    public List<T> getAll() throws ForbiddenException {
        return userBean.getUser().getRoleId().equals(roleSystemAdministrator) ? super.getAll() :
                repo.getAllByCompanyId(userBean.getUser().getCompanyId());
    }


    @Override
    public T findById(@PathVariable ID id) throws ForbiddenException {
        T object = super.findById(id);
        if (object == null || (!userBean.getUser().getRoleId().equals(roleSystemAdministrator) && !userBean.getUser().getCompanyId().equals(object.getCompanyId())))
            object = null;
        return object;
    }

    @Override
    public String update(@PathVariable ID id, @RequestBody T object) throws BadRequestException, ForbiddenException {
        if (findById(id) == null)
            throw new BadRequestException(badRequestUpdate);
        return super.update(id, object);
    }
}
