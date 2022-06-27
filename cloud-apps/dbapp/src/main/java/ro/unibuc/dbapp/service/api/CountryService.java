package ro.unibuc.dbapp.service.api;

import ro.unibuc.dbapp.model.Country;
import ro.unibuc.dbapp.web.dto.CountrySave;

public interface CountryService {

    Country save(CountrySave item);

    Iterable<Country> getAll();

    Country getOne(long id);

    Country edit(long id, CountrySave item);

    void delete(long id);
}
