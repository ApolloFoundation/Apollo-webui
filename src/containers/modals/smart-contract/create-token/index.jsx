/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik, Field } from "formik";
import moment from "moment";
import { processAccountRStoHex } from "apl-web-crypto";
import { getTokenList, getTokensForm } from "../../../../actions/contracts";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { convertToATM } from "../../../../helpers/converters";
import TextualInputComponent from "../../../components/form-components/textual-input1";
import InputDate from "../../../components/input-date";
import Button from "../../../components/button";
import { fieldValidate, validationForm } from './form/form-validation';
import AccountRSForm from "../../../components/form-components/account-rs1";

const CreateToken = ({ closeModal }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const [tokenList, setTokenList] = useState([]);
  const [currentToken, setCurrentToken] = useState(null);
  const [formFieldsList, setFormFieldsList] = useState([]);
  const [token, setToken] = useState(1);
  const [apl, setApl] = useState(1);

  const getStateTokenList = useCallback(async () => {
    const { modules } = await dispatch(getTokenList("token"));
    if (modules) {
      setTokenList(modules);
      setCurrentToken(modules[0]);
    }
  }, [dispatch]);

  const getStateTokensForm = useCallback(
    async (currentToken) => {
      const { members } = await dispatch(getTokensForm(currentToken));
      if (members) {
        setFormFieldsList(members[0].inputs);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    getStateTokenList();
  }, [dispatch]);

  useEffect(() => {
    if (currentToken) {
      getStateTokensForm(currentToken);
    }
  }, [dispatch, currentToken]);

  const setInitialValues = (fields) => {
    return fields.reduce(
      (acc, field) => {
        acc[field.name] = field.name === "rate" ? 1 : "";
        return acc;
      },
      { atm: "", token: "" }
    );
  };

  const submitForm = useCallback(
    ({ atm, token, ...values }) => {
      const isValidForm = validationForm(values);
      if (!isValidForm) {
        Object.keys(values).map((key) => {
          if (/^APL/.test(values[key])) {
            return (values[key] = processAccountRStoHex(values[key], true));
          } else if (key === "releaseDelay") {
            return values[key];
          } else if (/^\d+(?:[\.,]\d+)?$/.test(values[key])) {
            return (values[key] = convertToATM(values[key]));
          }
          return values[key];
        });
        dispatch(
          setBodyModalParamsAction("SMC_APROVE_TOKEN", {
            params: values,
            token: currentToken,
            type: "token",
          })
        );
      }
    },
    [dispatch, currentToken]
  );

  const handleChangeAPL = useCallback(
    (setFieldValue, e) => {
      const value = e.target.value;
      setFieldValue("atm", value);
      setApl(value);

      if (value && token) {
        const currentRate = +value ? (token / value).toLocaleString("en", {
          useGrouping: false,
          maximumFractionDigits: 8,
        }) : '0';
        setFieldValue("rate", currentRate);
      }
    },
    [token]
  );

  const handleChangeToken = (setFieldValue, e) => {
    const value = e.target.value;

    setFieldValue("token", value);
    setToken(value);

    if (value && apl) {
      const currentRate = (value / apl).toLocaleString("en", {
        useGrouping: false,
        maximumFractionDigits: 8,
      });
      setFieldValue("rate", currentRate);
    }
  };

  const handleChangeTokenType = (e) => {
    setCurrentToken(e.target.value);
  };

  return (
    <div className="modal-box wide">
      <Formik
        enableReinitialize
        onSubmit={submitForm}
        initialValues={setInitialValues(formFieldsList)}
      >
        {({ errors, touched, setFieldValue, values }) => {
          return (
            <Form>
              <div className="modal-form">
                <div className="form-group-app">
                  <button
                    type="button"
                    id="button-close-modal-create-token"
                    onClick={closeModal}
                    className="exit"
                  >
                    <i className="zmdi zmdi-close" />
                  </button>
                  <div className="form-title">
                    <p>Create token</p>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex">
                      {tokenList.map((item, index) => (
                        <div key={item} className="d-flex align-items-center">
                          <label
                            htmlFor="text"
                            className="mr-2 mb-0 d-flex align-items-center"
                          >
                            {item}
                          </label>
                          <Field
                            id={`check-box-${index}-create-token`}
                            type="radio"
                            name="token"
                            value={item}
                            checked={item === currentToken}
                            onChange={handleChangeTokenType}
                            className="mr-3 d-inline-block"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {formFieldsList.map((item) => {
                    if (item.name === "rate") {
                      return (
                        <div
                          key={item.name}
                          className="border-top border-bottom mb-3 pt-3"
                        >
                          <div className="row w-100 m-0 justify-content-between align-items-center mb-3">
                            <div className="col-5 p-0">
                              <TextualInputComponent
                                className={"text-capitalize"}
                                label="Amount APL"
                                name="atm"
                                placeholder="Amount APL"
                                type="float"

                              />
                            </div>
                            <div className="col-auto">
                              <i class="zmdi zmdi-swap zmdi-hc-2x"></i>
                            </div>
                            <div className="col-5 p-0">
                              <TextualInputComponent
                                className={"text-capitalize"}
                                label="Amount Token"
                                name="token"
                                placeholder="Amount Token"
                                type="float"
                              />
                            </div>
                          </div>
                          <Field
                            name={item.name}
                            validate={(value) => fieldValidate(value, item.type)}
                            render={({ field: { name } }) => (
                              <div className="mb-3">
                                <TextualInputComponent
                                  className={"text-capitalize"}
                                  label={name}
                                  name={name}
                                  placeholder={name}
                                  type="float"
                                />
                                {errors[name] && touched[name] && (
                                  <div className={"text-danger"}>
                                    {errors[item.name]}
                                  </div>
                                )}
                              </div>
                            )}
                          />
                        </div>
                      );
                    }
                    if (item.type === "address") {
                      return (
                        <Field
                          name={item.name}
                          validate={(value) => fieldValidate(value, item.type)}
                          render={({ field: { name } }) => {
                            return (
                              <div className="mb-3">
                                <AccountRSForm
                                  className={"text-capitalize"}
                                  label={name}
                                  name={name}
                                  placeholder={name}
                                />
                                {errors[name] && touched[name] && (
                                  <div className={"text-danger"}>
                                    {errors[item.name]}
                                  </div>
                                )}
                              </div>
                            );
                          }}
                        />
                      );
                    }
                    if (item.type === "timestamp") {
                      return (
                        <Field
                          name={item.name}
                          validate={(value) => fieldValidate(value, item.type)}
                          render={({ field: { name } }) => (
                            <div className="mb-3">
                              <InputDate
                                label={name}
                                selected={startDate}
                                onChange={(date) => {
                                  setStartDate(date);
                                  setFieldValue(
                                    name,
                                    moment(date).toISOString()
                                  );
                                }}
                                name={name}
                                showTimeSelect
                                timeIntervals={1}
                                timeFormat="HH:mm:ss"
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm:ss aa"
                              />
                              {errors[name] && touched[name] && (
                                <div className={"text-danger"}>
                                  {errors[item.name]}
                                </div>
                              )}
                            </div>
                          )}
                        />
                      );
                    }
                    return (
                      <Field
                        name={item.name}
                        validate={(value) => fieldValidate(value, item.type)}
                        render={({ field: { name } }) => (
                          <div className="mb-3">
                            <TextualInputComponent
                              className={"text-capitalize"}
                              label={name}
                              name={name}
                              placeholder={name}
                              type={item.type === "uint" ? "float" : "text"}
                            />
                            {errors[name] && touched[name] && (
                              <div className={"text-danger"}>
                                {errors[item.name]}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    );
                  })}
                  <Button
                    id="button-create-token"
                    type="submit"
                    size="lg"
                    color="green"
                    name="Preview"
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default CreateToken;
