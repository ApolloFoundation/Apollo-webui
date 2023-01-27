/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback } from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {NotificationManager} from "react-notifications";
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';
import { getAccountInfoSelector } from 'selectors';
import { FeeWrapper } from 'containers/components/form-components/FeeWrapper';
import ModalBody from 'containers/components/modals/modal-body';

const  AccountInfo = (props) => {
    const accountInfo = useSelector(getAccountInfoSelector, shallowEqual);

    const handleFormSubmit = useCallback(async (values) => {
        const res = await props.processForm({ ...values }, 'setAccountInfo');

        if (res && !res.errorCode) {
            props.closeModal();
            NotificationManager.success('Account info has been submitted!', null, 5000);
        }
    }, [props.closeModal, props.processForm]);

    return (
        <ModalBody
            modalTitle="Set Account Info"
            submitButtonName="Update Account Info"
            nameModal={props.nameModal}
            handleFormSubmit={handleFormSubmit}
            initialValues={{ 
                feeATM: 1,
                isCustomFee: false,
                name: accountInfo.name,
                description: accountInfo.description,
            }}
            closeModal={props.closeModal}
        >
            <CustomInput
                label="Name"
                placeholder="Your name"
                name="name"
            />
            <CustomTextArea
                label="Description"
                placeholder="Description"
                name="message"
                cols="6"
                rows="10"
            />
            <FeeWrapper name='feeATM' />
        </ModalBody>
    );
}

export default AccountInfo;
