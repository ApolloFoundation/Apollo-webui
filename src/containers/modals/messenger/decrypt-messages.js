/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { Form, Text, Radio, RadioGroup, TextArea, Checkbox } from "react-form";
import converters from '../../../helpers/converters';
import {connect} from 'react-redux';
import {setModalData, setMopalType, setBodyModalParamsAction} from '../../../modules/modals';
import {setAccountPassphrase} from '../../../modules/account';
import curve25519 from '../../../helpers/crypto/curve25519'
import crypto from  '../../../helpers/crypto/crypto';
import InputForm from '../../components/input-form'
import InfoBox from '../../components/info-box';
import ModalFooter from '../../components/modal-footer'

const mapStateToProps = state => ({
    publicKey: state.account.publicKey,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setMopalType: (passphrase) => dispatch(setMopalType(passphrase)),
    setBodyModalParamsAction: (passphrase) => dispatch(setBodyModalParamsAction(passphrase)),
    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    setAccountPassphrase: (passphrase) => dispatch(setAccountPassphrase(passphrase))
});

class DecryptMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passphraseStatus: false
        };

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async validatePassphrase(passphrase) {
        return await this.props.validatePassphrase(passphrase);
    }

    async handleFormSubmit(params) {
        let passphrase = params.passphrase;
        const isPassed = await this.validatePassphrase(passphrase);

        if (params.passphrase) {
            delete params.secretPhrase;
            if (params.isRememberPassphrase) {
                localStorage.setItem('secretPhrase', JSON.stringify(params.passphrase))
            }
            this.props.setAccountPassphrase(params.passphrase);
            this.closeModal();
        }
        if (params.secretPhrase) {
            delete params.passphrase;
            if (params.isRememberPassphrase) {
                localStorage.setItem('secretPhrase', JSON.stringify(params.secretPhrase))
            }
            this.props.setAccountPassphrase(params.secretPhrase);
            this.closeModal();
        }
    }

    closeModal = () => {
        const modalWindow = document.querySelector('.modal-window');

        if (Object.values(modalWindow.classList).indexOf('active') !== -1) {
            modalWindow.classList.remove('active');
            setTimeout(() => {
                this.props.setMopalType(null);

            }, 300);
        }
    };

    render() {
        return (
            <div className="modal-box">
                <Form
                    onSubmit={values => this.handleFormSubmit(values)}
                    render={({
                                 submitForm, setValue, values, getFormState
                             }) => (
                        <form className="modal-form"  onSubmit={submitForm}>
                            <div className="form-group-app">
                                <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                                <div className="form-title">
                                    <p>Decrypt messages</p>
                                </div>
                                <div className="form-group row form-group-white mb-15">
                                    <label className="col-sm-3 col-form-label">
                                        Passphrase&nbsp;<i className="zmdi zmdi-portable-wifi-changes"/>
                                    </label>
                                    <div className="col-sm-9">

                                        <InputForm
                                            type="password"
                                            field="secretPhrase"
                                            placeholder="Secret Phrase"
                                            setValue={setValue}/>
                                    </div>
                                </div>
                                <div className="input-group-app">
                                    <div className="row">
                                        <div className="col-md-3">
                                        </div>
                                        <div className="col-md-9">
                                            <div className="input-wrapper">
                                                <div className="form-sub-actions">
                                                    <div className="input-group-app align-middle display-block offset-bottom offset-top">
                                                        <Checkbox style={{display: 'inline-block'}} type="checkbox" field="isRememberPassphrase"/>
                                                        <label style={{display: 'inline-block'}}>Remember passphrase for decryption</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="input-group-app">*/}
                                    {/*<div className="row">*/}
                                        {/*<div className="col-md-3">*/}
                                            {/*<label>Shared Key</label>*/}
                                        {/*</div>*/}
                                        {/*<div className="col-md-9">*/}
                                            {/*<Text field="sharedKey" placeholder='Shared Key' />*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                                {
                                    this.state.passphraseStatus &&
                                    <InfoBox danger mt>
                                        Incorect passphrase.
                                    </InfoBox>
                                }

                                <button type="submit" className="btn btn-right">Enter</button>
                            </div>
                        </form>
                    )} />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecryptMessage);
