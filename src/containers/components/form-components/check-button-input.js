import React from 'react';
import {Checkbox} from 'react-form';
import uuid from 'uuid';

export const CheckboxFormInput = (props) => {
    const {checkboxes, label} = props;

    return (
        <div className="row form-group-grey">
            {
                label &&
                <div className={`col-md-3 pl-0`}>
                    <span>{label}</span>
                </div>
            }
            
            <div className={`col-md-9 ${label ? '' : 'offset-md-3'}`}>
                {
                    checkboxes &&
                    checkboxes.map(el => {
                        const id = uuid();
                        return (
                            <div className="form-check custom-checkbox mb-15">
                                <Checkbox className="form-check-input custom-control-input"
                                    type="checkbox"
                                    onChange={() => {
                                        if (el.handler) {
                                            el.handler()
                                        }
                                    }}
                                    defaultValue={el.defaultValue}
                                    field={el.field}
                                    id={id}
                                />
                                <label 
                                    htmlFor={id}
                                    className="form-check-label custom-control-label"
                                >
                                    {el.label}
                                </label>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}