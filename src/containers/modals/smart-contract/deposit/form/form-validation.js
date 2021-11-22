import { NotificationManager } from "react-notifications";

const hexaRegExp = /0x[0-9a-fA-F]+/i;
const rsRegExp = /APL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}/i;

const errorsList = {
  secretPhrase: "Incorrect SecretPhrase",
  fuelPrice: "Fuel Price is required.",
  fuelLimit: "Fuel Limit is required.",
  name: "Call method is required.",
  address: "Contract is required.",
  sender: "Incorrect Payee",
  token: "Incorrect Token",
};

export function validationForm(values, passPhrase) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if ((!value || value.length === 0) && errorsList[key]) {
      NotificationManager.error(errorsList[key], "Error", 5000);
      return true;
    } else if (key === "secretPhrase" && value !== passPhrase) {
      NotificationManager.error(errorsList[key], "Error", 5000);
      return true;
    } else if ((key === "sender" || key === "token") && !rsRegExp.test(value) && !hexaRegExp.test(value)) {
      NotificationManager.error(errorsList[key], "Error", 5000);
      return true;
    }
    return acc;
  }, false);
}
