/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {NotificationManager} from 'react-notifications';
import submitForm from '../../../helpers/forms/forms'
import {setBodyModalParamsAction, setModalData, setModalType} from '../../../modules/modals';
import store from '../../../store'
import crypto from '../../../helpers/crypto/crypto';
import {getForging} from '../../../actions/login';
import InfoBox from '../../components/info-box';
import ModalBody from '../../components/modals/modal-body';
import TextualInputComponent from '../../components/form-components/textual-input';
import {CheckboxFormInput} from '../../components/form-components/check-button-input';
import {setAccountPassphrase} from "../../../modules/account";

class ConfirmForging extends React.Component {

    validatePassphrase = async (passphrase) => {
        return await this.props.validatePassphrase(passphrase);
    };

    handleFormSubmit = async (params) => {
        if (!this.props.balanceATM || (this.props.balanceATM / 100000000) < 1000) {
            NotificationManager.error('You can start forging only if your effective balance exceed 1000 APL.', 'Error', 5000);
            return;
        }
        const action = this.props.action.getStatus;
        const passphrase = this.checkPassphrase() || params.passphrase;
        const requestParams = {
            requestType: action,
            passphrase: passphrase,
            account: this.props.account,
            ...params
        };
        const forging = await store.dispatch(await submitForm.submitForm(requestParams, action));

        if (forging) {
            if (!forging.errorCode) {
                const forgingStatus = await this.props.getForging();

                if (action === 'startForging') {
                    NotificationManager.success(`Forging has been ${action === 'startForging' ? 'started' : 'stopped'}.`, null, 5000);
                }

                if (params.isSavePassphrase) {
                    localStorage.setItem('secretPhrase', JSON.stringify(passphrase.toString()));
                }

                this.props.setAccountPassphrase(passphrase);
                this.props.action.handleSuccess(forgingStatus);
                this.props.closeModal();
            } else {
                NotificationManager.error(forging.errorDescription, 'Error', 5000);
            }
        }
    };

    checkPassphrase = () => JSON.parse(localStorage.getItem('secretPhrase')) || this.props.passphrase;

    render() {
        const {action, is2FA} = this.props;
        const forgingAction = action && action.getStatus === 'startForging' ? 'start' : 'stop';
        const passphrase = this.checkPassphrase();

        console.log('------is2FA', is2FA);
        return (
            <ModalBody
                loadForm={this.loadForm}
                modalTitle={`Confirm ${forgingAction} forging`}
                modalSubTitle={`If you want to ${forgingAction} forging, type your ${!passphrase ? 'Secret Phrase':''} ${(!passphrase && is2FA) ? 'and':''} ${is2FA ? '2FA code':''} to confirm.`}
                closeModal={this.props.closeModal}
                handleFormSubmit={(values) => this.handleFormSubmit(values)}
                submitButtonName={`${forgingAction.charAt(0).toUpperCase() + forgingAction.slice(1)} forging`}
                isDisableSecretPhrase
                nameModel={this.props.nameModal}
            >
                {action.getStatus === 'startForging' && (
                    <InfoBox info>
                        You can start forging only if your effective balance exceed 1000 Apollo.
                    </InfoBox>
                )}

                {!passphrase && (
                    <div>
                        <TextualInputComponent
                            field={'passphrase'}
                            type={'password'}
                            label={'Secret Phrase'}
                            placeholder={'Secret Phrase'}
                        />

                        <CheckboxFormInput
                            checkboxes={[
                                {
                                    field: 'isSavePassphrase',
                                    handler: null,
                                    label: 'Keep forging?'
                                }
                            ]}
                        />
                    </div>
                )}
                {is2FA && (
                    <TextualInputComponent
                        field={'code2FA'}
                        type={'password'}
                        label={'2FA code'}
                        placeholder={'2FA code'}
                    />
                )}
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    action: state.modals.modalData,
    passphrase: state.account.passPhrase,
    account: state.account.account,
    is2FA: state.account.is2FA,
    balanceATM: state.account.balanceATM,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setModalType: (passphrase) => dispatch(setModalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    getForging: (reqParams) => dispatch(getForging(reqParams)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmForging);
