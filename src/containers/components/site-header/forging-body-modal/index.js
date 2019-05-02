import React, {Component} from 'react';
import classNames from 'classnames';
import {connect} from 'react-redux';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {setForging, getForging} from '../../../../actions/login';
import {NotificationManager} from "react-notifications";


class ForgingBodyModalWindow extends Component {

    setForgingData= (action) => {
        return {
            getStatus: action,
            handleSuccess: (res) => {
                this.setState({forgingStatus: res});
            }
        }
    };
    
    setForging = async (action) => {
        if (!this.props.balanceATM || (this.props.balanceATM / 100000000) < 1000) {
            NotificationManager.error('You can start forging only if your effective balance exceed 1000 APL.', 'Error', 5000);
            return;
        }
        const passPhrase = JSON.parse(localStorage.getItem('secretPhrase')) || this.props.secretPhrase;
        if (!passPhrase || this.props.is2FA) {
            this.props.setBodyModalParamsAction('CONFIRM_FORGING', this.setForgingData(action.requestType))
        } else {
            const forging = await this.props.setForging({requestType: action.requestType});

            if (forging) {
                if (!forging.errorCode) {
                    const forgingStatus = await this.props.getForging();

                    if (!forgingStatus.errorCode) {
                        this.setState({forgingStatus: forgingStatus});
                    } else {
                        NotificationManager.error('Something went wrong. Please, try again later', 'Error', 5000);
                    }
                } else {
                    NotificationManager.error(forging.errorDescription, 'Error', 5000);
                }
            }
        }
    };

    render() {
        const {forgingStatus, forgedBalanceATM, isActive, actualBlock, closeMenu} = this.props;

        return (
            <div className={classNames({
                "account-body-modal": true,
                "forging-body-modal-window": true,
                "active": isActive,
                "settings-menu": true,
                "settings-bar": true,
                "p-0": true
            })}>
                <div className="form-group-app">
                    <div className="form-body">
                        <div className="input-section p-0">
        
                            <div className="image-button success">
                                <i className="zmdi zmdi-check-circle"/>
                                <label>Connected</label>
                            </div>
        
                            {
                                forgingStatus &&
                                forgingStatus.errorCode === 5 &&
                                <a
                                    onClick={() => this.setForging({requestType: 'startForging'})}
                                    className="image-button  danger"
                                >
                                    <i className="zmdi zmdi-close-circle"/>
                                    <label>Not forging</label>
                                </a>
                            }
                            {
                                forgingStatus &&
                                !forgingStatus.errorCode &&
                                <a
                                    onClick={() => this.setForging({requestType: 'stopForging'})}
                                    className="image-button  success"
                                >
                                    <i className="zmdi zmdi-check-circle"/>
                                    <label>Forging</label>
                                </a>
                            }
                            {forgingStatus &&
                            (
                                forgingStatus.errorCode === 8 || forgingStatus.errorCode === 4 ||
                                forgingStatus.errorCode === 3 || forgingStatus.errorCode === 2 ||
                                forgingStatus.errorCode === 1
                            ) && (
                                <a
                                    onClick={() => this.setForging({requestType: 'startForging'})}
                                    className="image-button danger"
                                >
                                    <i className="zmdi zmdi-help"/>
                                    <label>Unknown forging status</label>
                                </a>
                            )}
        
                            <p className="mb-2">
                                {
                                    actualBlock &&
                                    <label>Height: {actualBlock}</label>
                                }
                            </p>
                            <p>
                                {
                                    forgedBalanceATM &&
                                    <label>Forged balance: {(forgedBalanceATM / 100000000).toLocaleString('en')}&nbsp;APL</label>
                                }
                            </p>
                            <div className="btn-block text-center d-sm-block d-md-none">
                                <div className="close-menu-btn" onClick={closeMenu}>
                                    Close
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
}

const mapStateToProps = state => ({
    forgingStatus: state.account.forgingStatus,
    publicKey: state.account.publicKey,
    forgedBalanceATM: state.account.forgedBalanceATM,
    moalTtype: state.modals.modalType,
    modalData: state.modals.modalData,
    actualBlock: state.account.actualBlock,
    secretPhrase: state.account.passPhrase,
    is2FA: state.account.is2FA,
    balanceATM: state.account.balanceATM,
});

const mapDispatchToProps = dispatch =>({
    setBodyModalParamsAction: (type, value) => dispatch(setBodyModalParamsAction(type, value)),
    setForging: (reqParams) => dispatch(setForging(reqParams)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgingBodyModalWindow);