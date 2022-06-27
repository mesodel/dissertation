package ro.unibuc.dbapp.service.impl;

import org.springframework.stereotype.Service;
import ro.unibuc.dbapp.model.Country;
import ro.unibuc.dbapp.repo.CountryRepository;
import ro.unibuc.dbapp.service.api.CountryService;
import ro.unibuc.dbapp.web.dto.CountrySave;

import java.util.NoSuchElementException;

@Service
public class CountryServiceImpl implements CountryService {

    private final CountryRepository repository;

    public CountryServiceImpl(CountryRepository repository) {
        this.repository = repository;
    }

    @Override
    public Country save(CountrySave item) {
        var dbItem = new Country();
        dbItem.setName(item.getName());

        return repository.save(dbItem);
    }

    @Override
    public Iterable<Country> getAll() {
        return repository.findAll();
    }

    @Override
    public Country getOne(long id) {
        return repository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public Country edit(long id, CountrySave item) {
        var optional = repository.findById(id);
        var dbItem = optional.orElseThrow(NoSuchElementException::new);

        dbItem.setName(item.getName());

        return repository.save(dbItem);
    }

    @Override
    public void delete(long id) {
        var optional = repository.findById(id);
        var dbItem = optional.orElseThrow(NoSuchElementException::new);

        repository.delete(dbItem);
    }
}
