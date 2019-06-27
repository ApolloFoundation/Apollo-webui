import React from 'react';
import {connect} from 'react-redux';
import SiteHeader from '../../../components/site-header';
import InfoBox from '../../../components/info-box';

import ExchangeHeader from './exchange-header';
import Plot from './plot';
import TradeHistoryExchange from './trade-history';
import OpenOrders from './open-orders';
import {setCurrentCurrencyAction} from "../../../../modules/exchange";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {
    getBuyOpenOffers,
    getCurrencyBalance,
    getMyOpenOffers,
    getPlotBuyOpenOffers,
    getPlotSellOpenOffers,
    getSellOpenOffers
} from "../../../../actions/wallet";
import Orderbook from "./orderbook";
import TradeApollo from "./trade-apollo";
import TwitterBanner from "../../../../assets/twitter-banner2.png";

class Exchange extends React.Component {
    state = {
        wallets: null
    };

    componentDidMount() {
        let wallets = localStorage.getItem('wallets');
        if (!wallets) {
            this.handleLoginModal();
        } else {
            this.getCurrencyBalance(JSON.parse(wallets));
        }
        this.props.getBuyOpenOffers();
        this.props.getSellOpenOffers();
        this.props.getPlotBuyOpenOffers();
        this.props.getPlotSellOpenOffers();
        this.props.getMyOpenOffers();
    }

    componentDidUpdate() {
        if (!this.state.wallets && this.props.wallets) {
            this.getCurrencyBalance(this.props.wallets);
        }
    }

    getCurrencyBalance = async (wallets) => {
        let params = {};
        wallets.map(wallet => {
            params[wallet.currency] = [];
            wallet.wallets.map(walletItem => {
                params[wallet.currency].push(walletItem.address);
                return walletItem;
            });
            return wallet;
        });
        const walletsBalances = await this.props.getCurrencyBalance(params);
        if (walletsBalances) {
            this.setState({wallets: walletsBalances});
        }
    };

    handleLoginModal = () => {
        this.props.setBodyModalParamsAction('LOGIN_EXCHANGE', {});
    };

    switchCurrency = (currency) => {
        this.props.getBuyOpenOffers(currency);
        this.props.getSellOpenOffers(currency);
        this.props.getPlotBuyOpenOffers(currency);
        this.props.getPlotSellOpenOffers(currency);
        this.props.getMyOpenOffers(currency);
        this.props.setCurrentCurrency(currency);
    };

    render() {
        const {currencies, currentCurrency, buyOrders, sellOrders, plotBuyOrders, plotSellOrders, myOrders} = this.props;
        const wallet = this.state.wallets && this.state.wallets['eth'];
        const buyOrdersCurrency = buyOrders[currentCurrency.currency];
        const sellOrdersCurrency = sellOrders[currentCurrency.currency];
        const plotBuyOrdersCurrency = plotBuyOrders[currentCurrency.currency];
        const plotSellOrdersCurrency = plotSellOrders[currentCurrency.currency];
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Decentralized Exchange'}
                />
                <div className="page-body exchange">
                    <div className={'container-fluid p-0'}>
                        <div className={'cards-wrap row'}>
                            <div className={'col-md-12 p-0'}>
                                <InfoBox info>
                                    Please, notice - this is the first version on Apollo Exchange. Functionality of
                                    trading
                                    will be delivered in future releases. At the moment you can deposit in ETH and PAX.
                                    Please, check our updates in the official <a
                                    href={'https://t.me/apolloofficialannouncements'} target='_blank'
                                    rel='noopener noreferrer'>Telegram channel</a> to be the first to use Apollo
                                    Exchange
                                </InfoBox>
                            </div>
                        </div>
                        <div className={'cards-wrap row'}>
                            <div className={'col-md-12 p-0'}>
                                <ExchangeHeader
                                    currencies={currencies}
                                    currentCurrency={currentCurrency}
                                    switchCurrency={this.switchCurrency}
                                    wallet={wallet}
                                    handleLoginModal={this.handleLoginModal}
                                />
                            </div>
                        </div>
                        <div className={'cards-wrap row'}>
                            <div className={'col-md-9 p-0'}>
                                <div className={'row'}>
                                    <div className={'col-md-8 p-0'}>
                                        <Plot
                                            currentCurrency={currentCurrency}
                                            buyOrders={plotBuyOrdersCurrency}
                                            sellOrders={plotSellOrdersCurrency}
                                        />
                                    </div>
                                    <div className={'col-md-4 p-0'}>
                                        <TradeApollo
                                            currentCurrency={currentCurrency}
                                            wallet={wallet}
                                            handleLoginModal={this.handleLoginModal}
                                        />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-md-4 p-0'}>
                                        <TradeHistoryExchange
                                            currentCurrency={currentCurrency}
                                            wallet={wallet}
                                            handleLoginModal={this.handleLoginModal}
                                        />
                                    </div>
                                    <div className={'col-md-4 p-0'}>
                                        <OpenOrders
                                            currentCurrency={currentCurrency}
                                            handleLoginModal={this.handleLoginModal}
                                            myOrders={myOrders[currentCurrency.currency]}
                                        />
                                    </div>
                                    <div className={'col-md-4 p-0'}>
                                        <a
                                            href={'https://twitter.com/ApolloCurrency'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`card card-square`}
                                            style={{backgroundImage: `url(${TwitterBanner})`}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={'col-md-3 p-0'}>
                                <Orderbook
                                    currentCurrency={currentCurrency}
                                    buyOrders={buyOrdersCurrency}
                                    sellOrders={sellOrdersCurrency}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({exchange, account}) => ({
    wallets: account.wallets,
    currencies: exchange.currencies,
    currentCurrency: exchange.currentCurrency,
    buyOrders: exchange.buyOrders,
    sellOrders: exchange.sellOrders,
    plotBuyOrders: exchange.plotBuyOrders,
    plotSellOrders: exchange.plotSellOrders,
    myOrders: exchange.myOrders,
});

const mapDispatchToProps = dispatch => ({
    setCurrentCurrency: (currency) => dispatch(setCurrentCurrencyAction(currency)),
    getCurrencyBalance: (params) => dispatch(getCurrencyBalance(params)),
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
    getBuyOpenOffers: (currency) => dispatch(getBuyOpenOffers(currency)),
    getSellOpenOffers: (currency) => dispatch(getSellOpenOffers(currency)),
    getPlotBuyOpenOffers: (currency) => dispatch(getPlotBuyOpenOffers(currency)),
    getPlotSellOpenOffers: (currency) => dispatch(getPlotSellOpenOffers(currency)),
    getMyOpenOffers: (currency) => dispatch(getMyOpenOffers(currency)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Exchange)