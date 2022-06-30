import {
  Container,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import axios from "axios";
import { Location } from "./models/addressResults";
import { useForm, Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import Select, { components, type SingleValueProps } from "react-select";
import { DevTool } from "@hookform/devtools";
import countries from "i18n-iso-countries";
import json from "i18n-iso-countries/langs/en.json";

countries.registerLocale(json);

const countriesAlpha2 = countries.getNames("en", { select: "all" });

const countriesForSelect = Object.keys(countriesAlpha2).map((country) => {
  return {
    label: countriesAlpha2[country][0],
    value: country,
  };
});

const getCountryCodeFromAPi = (location: Location) => {
  let _key: string = "";
  Object.keys(countriesAlpha2).some((key) => {
    const found = countriesAlpha2[key].includes(location?.address.countryName);
    if (found) {
      _key = key;
      return true;
    }
    return false;
  });
  return _key;
};

interface FormValues {
  address: string;
  city: string;
  country: string;
  postalCode: string;
  state: string;
}

const getStreetAddress = (location: Location) =>
  `${location?.address.houseNumber} ${location?.address.street}`;

const SingleValue = (props: SingleValueProps<Location, false>) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      {getStreetAddress(data)}
    </components.SingleValue>
  );
};
const getOptionValue = (location: Location) => getStreetAddress(location);

const getOptionLabel = (location: Location) => location.formattedAddress;

function App() {
  const { mutateAsync } = useMutation<Location[], Error, string>({
    mutationKey: ["addressSearch"],
    mutationFn: async (searchText) => {
      return axios
        .get(`http://localhost:3005?searchText=${searchText}`)
        .then(({ data }) => data.locations);
    },
  });

  const { handleSubmit, register, watch, control, setValue, reset } =
    useForm<FormValues>({
      defaultValues: {
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    });

  const submitHandler = handleSubmit((values) => {
    console.log("values: ", values);
  });
  const address = watch("address");

  const promiseOptions = async (inputValue: string) => {
    return mutateAsync(inputValue);
  };

  return (
    <>
      <Container mt='16' maxW='container.md'>
        <VStack alignItems='stretch'>
          <Heading as='h1'>Add Address</Heading>
          <form onSubmit={submitHandler} noValidate>
            <VStack spacing='5'>
              <FormControl>
                <FormLabel htmlFor='country'>Country</FormLabel>
                <Controller
                  {...{ control }}
                  name='country'
                  render={({ field: { name, value, onBlur, onChange } }) => {
                    return (
                      <Select
                        value={countriesForSelect.find(
                          (country) => country.value === value
                        )}
                        {...{ name, onBlur }}
                        options={countriesForSelect}
                        onChange={(option) => {
                          onChange(option?.value || "");
                        }}
                        escapeClearsValue
                        isClearable
                      />
                    );
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='address'>Street Address</FormLabel>
                <Controller
                  {...{ control }}
                  name='address'
                  render={({ field: { name, onBlur, onChange } }) => {
                    return (
                      <AsyncSelect
                        noOptionsMessage={() => "Begin Typing To See Options"}
                        components={{ SingleValue }}
                        escapeClearsValue
                        defaultInputValue={address}
                        isClearable
                        {...{ name, onBlur, getOptionLabel, getOptionValue }}
                        loadOptions={promiseOptions}
                        onChange={(location) => {
                          if (!location) {
                            setValue("city", "");
                            setValue("state", "");
                            setValue("postalCode", "");
                            onChange("");
                            setValue("country", "");
                          }
                          if (location?.address) {
                            setValue("city", location?.address.city);
                            setValue("state", location?.address.state);
                            setValue(
                              "postalCode",
                              location?.address.postalCode
                            );
                            onChange(getStreetAddress(location));
                            setValue(
                              "country",
                              getCountryCodeFromAPi(location)
                            );
                          }
                        }}
                      />
                    );
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='city'>City</FormLabel>
                <Input {...register("city")} id='city' type='city' />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='state'>State</FormLabel>
                <Input {...register("state")} id='state' type='state' />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='postalCode'>Postal Code</FormLabel>
                <Input
                  {...register("postalCode")}
                  id='postalCode'
                  type='postalCode'
                />
              </FormControl>
              <FormControl>
                <Button colorScheme='facebook' type='submit'>
                  Submit
                </Button>
              </FormControl>
            </VStack>
          </form>
        </VStack>
      </Container>
      <DevTool {...{ control }} />
    </>
  );
}

export default App;
