import React from 'react';
import TextualInput from '../../../components/form-components/TextualInput';
import NumericInput from '../../../components/form-components/NumericInput';
import TextArea from '../../../components/form-components/TextArea/TextAreaWithFormik';

const Form = ({ goods, formatTimestamp, decimals, ticker }) => (
    <>
        {
            goods &&
            <>
                <TextualInput
                    label="Date:"
                    text={formatTimestamp(goods.timestamp)}
                />
                <TextualInput
                    label="Seller:"
                    text={goods.sellerRS}
                />
                <TextualInput
                    label="Quantity:"
                    text={goods.quantity}
                />
                <TextualInput
                    label="Current price:"
                    text={`${(goods.priceATM / decimals).toLocaleString('en')} ${ticker}`}
                />
                <TextArea
                    label="Data"
                    placeholder="Description"
                    name="goodsToEncrypt"
                />
                <NumericInput
                    label="Discount"
                    name="discountATM"
                    placeholder="Discount"
                />
            </>
        }
    </>
)

export default Form;
