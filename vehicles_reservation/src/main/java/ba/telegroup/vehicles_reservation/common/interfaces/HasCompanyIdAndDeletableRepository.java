package ba.telegroup.vehicles_reservation.common.interfaces;

import java.util.List;

public interface HasCompanyIdAndDeletableRepository <T extends HasCompanyId & Deletable> extends DeletableRepository<T> {

    List<T> getAllByCompanyIdAndDeletedIs(Integer companyId, Byte deleted);
}
