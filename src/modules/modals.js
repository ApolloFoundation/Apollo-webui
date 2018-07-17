import axios from 'axios';
import config from '../config'

export const SET_MODAL_TYPE = 'SET_MODAL_TYPE';
export const SET_MODAL_DATA = 'SET_MODAL_DATA';

const initialState = {
    modalType: null,
    modalData: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_MODAL_TYPE:
            return {
                ...state,
                modalType: action.payload
            };
        case SET_MODAL_DATA:
            return {
                ...state,
                modalData: action.payload
            };

        default:
            return state
    }
}

export const setMopalType = (reqParams) => {
    return dispatch => {
        if (reqParams) {
            document.querySelector('.modal-window').classList.add('active');

        }

        dispatch({
            type: SET_MODAL_TYPE,
            payload: reqParams
        });
    }
};

export const setModalData = (data) => {
    return dispatch => {

        document.querySelector('.modal-window').classList.remove('active');
        setTimeout(()=> {
            dispatch({
                type: SET_MODAL_TYPE,
                payload: null
            });

        }, 300);
        dispatch({
            type: SET_MODAL_DATA,
            payload: data
        })
    }
}