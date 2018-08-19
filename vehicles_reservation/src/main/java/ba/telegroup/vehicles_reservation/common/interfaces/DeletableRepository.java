package ba.telegroup.vehicles_reservation.common.interfaces;

import java.util.List;

public interface DeletableRepository <T extends Deletable> {

    List<T> getAllByDeletedIs(Byte deleted);
}
