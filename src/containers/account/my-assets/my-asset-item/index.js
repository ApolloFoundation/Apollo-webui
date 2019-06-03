/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import {closeModal, setBodyModalParamsAction, setModalType} from "../../../../modules/modals";
import {connect} from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {getAskOrders, getBidOrders} from "../../../../actions/marketplace";
import store from '../../../../store';

class MyAssetItem extends React.Component {

    state = {};

    constructor(props) {
        super(props);

        this.getAskOrders();
        this.getBidOrders();
    }

    componentWillReceiveProps () {
        this.getAskOrders();
        this.getBidOrders();
    }

    getAskOrders = async () => {
        const {asset} = this.props;

        const askOrders = await this.props.getAskOrders(asset);

        if (askOrders) {
            let orders = Math.min(...askOrders.orders.map((el) => {
                return el.priceATM
            }));

            orders = isFinite(orders) ? orders : null;

            this.setState({
                lowestAskOrder : orders
            })

        }
    };

    getBidOrders = async () => {
        const {asset} = this.props;

        const bidOrders = await this.props.getBidOrders(asset);

        if (bidOrders) {

            if (bidOrders) {

                let orders = Math.max(...bidOrders.orders.map((el) => {
                    return el.priceATM
                }));

                orders = isFinite(orders) ? orders : null;

                this.setState({
                    highestBidOrder : orders
                })
            }
        }
    };

    close = () => {
        if (this.props.closeModal) {
            this.props.closeModal();
        };
    };

    gotToAsset = () => {
        const {asset, history, setBodyModalParamsAction} = this.props;

        setBodyModalParamsAction();
        history.push("/asset-exchange/" + asset);
    }

    render () {

        const {decimals, asset, name, unconfirmedQuantityATU, quantityATU} = this.props;

        return (
            <tr key={uuid()}>
                <td className="blue-link-text" >
                    <span
                        className={'cursor-pointer blue-link-text'}
                        onClick={this.gotToAsset}
                    >
                        {name}
                    </span>
                </td>
                <td>
                    {(unconfirmedQuantityATU / Math.pow(10, decimals)).toLocaleString('en', {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    })}
                </td>
                <td>
                    {(quantityATU  / Math.pow(10, decimals)).toLocaleString('en', {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    })}</td>
                <td>
                    {((parseInt(unconfirmedQuantityATU) / parseInt(quantityATU)) * 100).toFixed(2)}&nbsp;%
                </td>
                <td className="align-right">
                    {!this.props.info && (
                        <div className="btn-box inline">
                            <button
                                type={'button'}
                                onClick={() => this.props.setBodyModalParamsAction('TRANSFER_ASSET', {
                                    quantityATU: quantityATU / Math.pow(10, decimals),
                                    assetID:   asset,
                                    assetName: name,
                                    decimals,
                                    availableAssets: (quantityATU / Math.pow(10, decimals)).toLocaleString('en', {
                                        minimumFractionDigits: decimals,
                                        maximumFractionDigits: decimals
                                    })}
                                )}
                                className="btn btn-default"
                            >
                                Transfer
                            </button>
                            <button
                                type={'button'}
                                onClick={() => this.props.setBodyModalParamsAction('DELETE_SHARES', {
                                    quantityATU: quantityATU / Math.pow(10, decimals),
                                    assetID:   asset,
                                    decimals,
                                    assetName: name
                                })}
                                className="btn btn-default"
                            >
                                Delete Shares
                            </button>
                        </div>
                    )}
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    setModalType: (type) => dispatch(setModalType(type)),
    getAskOrders: asset => getAskOrders(asset),
    getBidOrders: asset => getBidOrders(asset),
});

export default connect(null, mapDispatchToProps)(withRouter(MyAssetItem));