/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { setLedgerTransactions } from "../../../../modules/dashboard";
import { formatTimestamp } from "../../../../helpers/util/time";
import Button from "../../../components/button";

export default function Entry(props) {
  const dispatch = useDispatch();

  const { decimals } = useSelector((state) => state.account);
  const {
    eventType,
    height,
    event,
    ledgerId,
    timestamp,
    holdingType,
    holdingInfo,
    change,
    balance,
  } = props;

  const showInfo = useCallback(() => {
    if (eventType === "BLOCK_GENERATED") {
      dispatch(setBodyModalParamsAction("INFO_BLOCK", height));
    } else {
      dispatch(
        setBodyModalParamsAction(
          "INFO_TRANSACTION",
          event,
          eventType === "PRIVATE_PAYMENT"
        )
      );
      if (eventType === "SMC_REFUNDED_FEE") {
        dispatch(setLedgerTransactions(ledgerId));
      }
    }
  }, [dispatch, event, eventType, height]);

  return (
    <>
      {ledgerId && (
        <tr>
          <td className="blue-link-text">
            <Button
              color="blue-link"
              onClick={() => {
                dispatch(
                  setBodyModalParamsAction(
                    "INFO_LEDGER_TRANSACTION",
                    ledgerId,
                    eventType === "PRIVATE_PAYMENT"
                  )
                );
              }}
              name={dispatch(formatTimestamp(timestamp))}
            />
          </td>
          <td>
            {ledgerId && eventType && eventType.split("_").join(" ")}
            &nbsp;&nbsp;
            <span className="zmdi zmdi-info pointer" onClick={showInfo} />
          </td>
          <td className="align-right">
            {holdingType === "UNCONFIRMED_APL_BALANCE" &&
              (change / decimals).toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
          <td className="align-right">
            {holdingType === "UNCONFIRMED_APL_BALANCE" &&
              balance > 0 &&
              (balance / decimals).toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
          <td className="align-right">{holdingInfo && holdingInfo.name}</td>
          <td className="align-right">
            {holdingType === "UNCONFIRMED_CURRENCY_BALANCE" &&
              holdingInfo &&
              holdingInfo.name &&
              (change / 10 ** holdingInfo.decimals).toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
            {holdingType === "UNCONFIRMED_ASSET_BALANCE" &&
              (change / decimals).toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
          <td className="align-right">
            {holdingType === "UNCONFIRMED_CURRENCY_BALANCE" &&
              holdingInfo &&
              holdingInfo.name &&
              (balance / 10 ** holdingInfo.decimals).toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
            {holdingType === "UNCONFIRMED_ASSET_BALANCE" &&
              (balance / decimals).toLocaleString("en", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}
          </td>
        </tr>
      )}
    </>
  );
}
