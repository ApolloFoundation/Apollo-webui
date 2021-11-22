import { NotificationManager } from "react-notifications";

const rsRegExp = /APL-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}/i;

const errorsList = {
  secretPhrase: "Incorrect Secret Phrase",
  fuelPrice: "Fuel Price is required.",
  fuelLimit: "Fuel Limit is required.",
  recipient: "Incorrect Recipient"
};

export function validationForm(values, passPhrase) {
  return Object.entries(values).reduce((acc, [key, value]) => {
    if ((!value || value.length === 0) && errorsList[key]) {
      NotificationManager.error(errorsList[key], "Error", 5000);
      return true;
    } else if (key === "secretPhrase" && value != passPhrase) {
      NotificationManager.error(errorsList[key], "Error", 5000);
      return true;
    } else if (key === "recipient" && !rsRegExp.test(value)) {
      NotificationManager.error(errorsList[key], "Error", 5000);
      return true;
    }
    return acc;
  }, false);
}