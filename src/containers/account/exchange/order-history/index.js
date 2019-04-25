import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table';
import {setCurrentCurrencyAction} from '../../../../modules/exchange';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {getMyOfferHistory} from '../../../../actions/wallet';
import {formatDivision, currencyTypes} from '../../../../helpers/format';
import InfoBox from '../../../components/info-box';

class OrderHistory extends React.Component {
    state = {
        loading: true,
    };

    componentDidMount() {
        let wallets = JSON.parse(localStorage.getItem('wallets'));
        if (!wallets) {
            this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
        } else {
            this.props.getMyOfferHistory();
            this.setState({loading: false});
        }
    }

    componentDidUpdate() {
        if (this.props.wallets && this.state.loading) {
            this.props.getMyOfferHistory();
            this.setState({loading: false});
        }
    }

    handleCancel = () => {
        NotificationManager.error('This functionality will be delivered in May 2019.', 'Error', 5000);
        // this.props.setBodyModalParamsAction('CONFIRM_CANCEL_ORDER', {});
    };

    render() {
        const {myOrderHistory} = this.props;
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Order History'}
                />
                <div className="exchange page-body container-fluid">
                    {!this.state.loading ? (
                    <div className={'card-block primary form-group-app p-0 mb-3'}>
                        <div className={'form-title form-title-lg d-flex flex-column justify-content-between'}>
                            <p className="title-lg">My orders</p>
                        </div>
                            <CustomTable
                                header={[
                                    {
                                        name: 'Pair name',
                                        alignRight: false
                                    }, {
                                        name: 'Type',
                                        alignRight: false
                                    }, {
                                        name: 'Price',
                                        alignRight: false
                                    }, {
                                        name: 'Amount',
                                        alignRight: false
                                    }, {
                                        name: 'Total',
                                        alignRight: false
                                    }, {
                                        name: 'Status',
                                        alignRight: false
                                    }, {
                                        name: ``,
                                        alignRight: true
                                    }
                                ]}
                                className={'no-min-height transparent'}
                                emptyMessage={'No created orders.'}
                                tableData={myOrderHistory}
                                TableRowComponent={(props) => {
                                    const pairRate = formatDivision(props.pairRate, 100000000, 9);
                                    const offerAmount = formatDivision(props.offerAmount, 100000000, 3);
                                    const total = formatDivision(props.pairRate * props.offerAmount, Math.pow(10, 16), 9);
                                    const currency = props.type === 1 ? props.pairCurrency : props.offerCurrency;
                                    const type = Object.keys(currencyTypes).find(key => currencyTypes[key] === currency);
                                    return (
                                        <tr>
                                            <td>APL/{type.toUpperCase()}</td>
                                            <td>{props.type === 0 ? 'BUY' : 'SELL'}</td>
                                            <td className={`${props.type === 1 ? 'red-text' : 'green-text'}`}>{pairRate}</td>
                                            <td>{offerAmount}</td>
                                            <td>{total}</td>
                                            <td className={`${props.status !== 0 ?'red-text' : ''}`}>{props.status === 0 ? 'Active' : 'Expired'}</td>
                                            <td className={'align-right'}>
                                                {props.status === 0 && (
                                                    <button
                                                        type={'button'}
                                                        className="btn btn-sm"
                                                        onClick={() => this.handleCancel({currency: type, pairRate, offerAmount, total})}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }}
                            />
                    </div>
                    ):(
                        <div>
                            <InfoBox default>
                                You have no wallets at that moment.&nbsp;
                                <a onClick={() => this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {})}>Log in</a>
                            </InfoBox>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({exchange, account}) => ({
    wallets: account.wallets,
    currentCurrency: exchange.currentCurrency,
    myOrderHistory: exchange.myOrderHistory,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
    setCurrentCurrency: (currency) => dispatch(setCurrentCurrencyAction(currency)),
    getMyOfferHistory: () => dispatch(getMyOfferHistory()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory)