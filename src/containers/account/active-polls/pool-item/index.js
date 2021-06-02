/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { formatTimestamp } from "../../../../helpers/util/time";
import { getTransactionAction } from "../../../../actions/transactions";
import Button from "../../../components/button";

const mapStateToProps = (state) => ({
  actualBlock: state.account.actualBlock,
  decimals: state.account.decimals,
  balanceAPL: state.account.unconfirmedBalanceATM,
});

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  formatTimestamp: (time) => dispatch(formatTimestamp(time)),
  getTransaction: (transaction) => dispatch(getTransactionAction(transaction)),
});

const PoolItem = (props) => {
  const blocksLeft = parseInt(props.finishHeight) - parseInt(props.actualBlock);
  let checkAction = false;
  if (
    props.minBalanceModel === 1 &&
    parseFloat(props.minBalance) >= props.balanceAPL / props.decimals
  ) {
    checkAction = true;
  }
  return (
    <tr key={uuidv4()}>
      <td>
        <Button
          color="blue-link"
          onClick={() =>
            props.setBodyModalParamsAction("INFO_TRANSACTION", props.poll)
          }
          name={props.name}
        />
      </td>
      <td>
        {" "}
        {props.description.length > 100
          ? `${props.description.slice(0, 100)}...`
          : props.description}{" "}
      </td>
      <td>
        <Button
          color="blue-link"
          onClick={() =>
            props.setBodyModalParamsAction("INFO_ACCOUNT", props.account)
          }
          name={props.accountRS}
        />
      </td>
      <td>{props.formatTimestamp(props.timestamp)}</td>
      <td>{blocksLeft || ""}</td>
      <td className="align-right">
        <div className="btn-box inline">
          <Button
            className={`btn btn-default ${checkAction ? "disabled" : ""}`}
            onClick={() =>
              props.setBodyModalParamsAction("CAST_VOTE", props.poll)
            }
            name={"Vote"}
          />
          <Button
            className={`btn btn-default ${checkAction ? "disabled" : ""}`}
            onClick={() =>
              props.setBodyModalParamsAction("POLL_RESULTS", props.poll)
            }
            name={"Results"}
          />
          <Link
            to={`/followed-polls/${props.poll}`}
            className="btn btn-default"
          >
            View
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PoolItem);
