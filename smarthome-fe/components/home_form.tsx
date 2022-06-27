import {
  Card,
  CardContent,
  Box,
  TextField,
  Autocomplete,
  CircularProgress,
  Button,
  Alert,
  Fade,
  Stack,
} from "@mui/material";
import * as React from "react";
import { Home } from "../lib/types";
import { CountryOption, CityOption } from "../pages/settings";
import styles from "../styles/home_form.module.css";

export interface IHomeFormProps {
  setShowErrorAlert: (show: boolean) => void;
  home: Home;
  setHome: (home: Home) => void;
}

export default function HomeForm(props: IHomeFormProps) {
  const [homeName, setHomeName] = React.useState("");
  const [homeCountry, setHomeCountry] = React.useState<CountryOption>();
  const [homeCity, setHomeCity] = React.useState<CityOption>();
  const [countries, setCountries] = React.useState<readonly CountryOption[]>(
    []
  );
  const [cities, setCities] = React.useState<readonly CityOption[]>([]);
  const [countryLoading, setCountryLoading] = React.useState(false);
  const [cityLoading, setCityLoading] = React.useState(false);

  const [nameError, setNameError] = React.useState(false);
  const [countryError, setCountryError] = React.useState(false);
  const [cityError, setCityError] = React.useState(false);
  const [hasErrors, setHasErrors] = React.useState(false);
  const [errorSaving, setErrorSaving] = React.useState(false);
  const [successSaving, setSuccessSaving] = React.useState(false);

  const [countryDisabled, setCountryDisabled] = React.useState(false);
  const [cityDisabled, setCityDisabled] = React.useState(false);

  const { setShowErrorAlert } = props;

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setHasErrors(false);
      setSuccessSaving(false);
      setErrorSaving(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [hasErrors, successSaving, errorSaving]);

  React.useEffect(() => {
    if (props.home === undefined || props.home === null) {
      return;
    }

    setHomeName(props.home.name);
    setCountryDisabled(true);
    setCityDisabled(true);
  }, [props.home]);

  const handleCountryOpen = async () => {
    if (countries !== undefined && countries?.length !== 0) {
      setCities([]);

      return;
    }

    setCountryLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/country/`);
    if (response.ok) {
      const countries = await response.json();
      setCountryLoading(false);
      setCountries(countries);
    }
  };

  const handleCountryClose = () => {
    setCountryLoading(false);
  };

  const handleCityOpen = async () => {
    if (cities !== undefined && cities.length !== 0) {
      setCityError(false);
      return;
    }

    if (homeCountry === undefined || homeCountry === null) {
      setShowErrorAlert(true);
      setCityError(true);
      return;
    }

    setCityLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/city/${homeCountry?.id}`
    );
    if (response.ok) {
      const cities = await response.json();
      setCityLoading(false);
      setCityError(false);
      setCities(cities);
    }
  };

  const handleCityClose = () => {
    setCityLoading(false);
  };

  const handleNameChange = (ev: object | null) => {
    // @ts-expect-error
    const newName = ev.target.value;

    setHomeName(newName);
  };

  const validateName = (name?: string) => {
    let toValidate = homeName;

    if (name !== null && name !== undefined) {
      toValidate = name as string;
    }

    if (
      toValidate === undefined ||
      toValidate === null ||
      toValidate.length === 0
    ) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const validateCity = () => {
    if (homeCity === undefined || homeCity === null) {
      setCityError(true);
    } else {
      setCityError(false);
    }
  };

  const validateCountry = () => {
    if (homeCountry === undefined || homeCountry === null) {
      setCountryError(true);
    } else {
      setCountryError(false);
    }
  };

  const validateFields = (): boolean => {
    validateName();
    validateCountry();
    validateCity();

    return nameError || countryError || cityError;
  };

  const updateHomeHandler = async () => {
    if (!props.home) {
      const hasErrors = validateFields();
      setHasErrors(hasErrors);
      if (hasErrors) {
        return;
      }
    }

    let payload = {
      name: homeName,
    };

    let response;
    if (props.home === undefined || props.home === null) {
      // @ts-expect-error
      payload.city = {
        id: homeCity?.id,
      };

      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/save`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home/edit`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (response.ok) {
      const home = await response.json();
      props.setHome(home);
      setSuccessSaving(true);
    } else {
      setErrorSaving(true);
    }
  };

  const homeSettings = (
    <Card
      style={{
        display: "flex",
      }}
    >
      <CardContent>
        <Box className={styles.formControl}>
          <TextField
            margin="dense"
            id="homeName"
            label="Home Name"
            type="text"
            error={nameError}
            sx={{ width: 300 }}
            variant="standard"
            value={homeName}
            onChange={handleNameChange}
          />
          <Autocomplete
            hidden={countryDisabled}
            id="homeCountry"
            sx={{ width: 300 }}
            value={homeCountry}
            loading={countryLoading}
            onOpen={handleCountryOpen}
            onClose={handleCountryClose}
            onChange={(event: any, newValue: CountryOption | null) =>
              // @ts-expect-error
              setHomeCountry(newValue)
            }
            options={countries}
            getOptionLabel={(option: CountryOption) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Home Country"
                error={countryError}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {countryLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          <Autocomplete
            hidden={cityDisabled}
            id="homeCity"
            sx={{ width: 300 }}
            value={homeCity}
            loading={cityLoading}
            onOpen={handleCityOpen}
            onClose={handleCityClose}
            onChange={(event: any, newValue: CityOption | null) =>
              // @ts-expect-error
              setHomeCity(newValue)
            }
            options={cities}
            getOptionLabel={(option: CityOption) => option.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Home City"
                error={cityError}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {cityLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
          <br />
          <Button onClick={updateHomeHandler} size="small">
            Save
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Fade in={true}>
      <Box>
        {homeSettings}
        <Stack
          sx={{
            bottom: "16px",
            position: "absolute",
          }}
          spacing={2}
        >
          <Fade in={hasErrors}>
            <Alert severity="error">Please fix the errors first</Alert>
          </Fade>
          <Fade in={errorSaving}>
            <Alert severity="error">
              There was an error processing your request
            </Alert>
          </Fade>
          <Fade in={successSaving}>
            <Alert severity="success">Request processed successfully</Alert>
          </Fade>
        </Stack>
      </Box>
    </Fade>
  );
}
