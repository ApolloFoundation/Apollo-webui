import React, {Component} from 'react';
import classNames from 'classnames';
import {Form, Text} from 'react-form';
import InputMask from 'react-input-mask'
import {connect} from 'react-redux';
import {getDGSTagsAction,} from '../../../../actions/marketplace'
import uuid from 'uuid';
import {Link, withRouter} from 'react-router-dom';
import AccountRS from "../../../components/account-rs";
import {NotificationManager} from "react-notifications";

class MarketplaceTags extends Component {
    state = {
        itemsPerPage: 10
    };

    componentDidMount = () => {
        this.getDGSTags({
            firstIndex: 0,
            lastIndex: this.state.itemsPerPage - 1,
            completed: true
        });
    };

    componentWillReceiveProps = (newProps) => {
        if (newProps.isShowMore){
            this.setState({
                page: 1,
                firstIndex: 0,
                lastIndex: 31,
                itemsPerPage: 32,
            }, () => {
                this.getDGSTags({
                    firstIndex: 0,
                    lastIndex: 31
                });
            });
        } else {
            this.setState({
                page: 1,
                firstIndex: 0,
                lastIndex: 9,
                itemsPerPage: 10
            }, () => {
                this.getDGSTags({
                    firstIndex: 0,
                    lastIndex: 9
                });
            });
        }
    };

    getDGSTags = async (reqParams) => {
        const getDGSTags = await this.props.getDGSTagsAction(reqParams);

        if (getDGSTags) {
            this.setState({
                getDGSTags: getDGSTags.tags
            })
        }
    };

    handleSearchByTag = (values) => {
        if (values.tag) {
            this.props.history.push('/marketplace/' + values.tag)
        }
    };

    handleSearchByAccount = (values) => {
        if (values && values.seller) {
            if (!values.seller.includes("_")) {
                this.props.history.push('/marketplace/' + values.seller);
            } else {
                NotificationManager.error('The account ID is incorrect.', 'Error', 5000);
            }
        }
    };

    onPaginate = (page) => {
        let reqParams = {
            page: page,
            firstIndex: page * this.state.itemsPerPage - this.state.itemsPerPage,
            lastIndex:  page * this.state.itemsPerPage - 1
        };

        this.setState({...reqParams}, () => {
            this.getDGSTags(reqParams)
        });
    };

    render () {

        const {showMoreController, isShowMore} = this.props;

        return (
            <div className="card  marketplace filters transparent">
                <div className="search-bar m-0">
                    <div className="row m-0">
                        <div className={classNames({
                            'col-md-12 pr-0 pl-0' : !isShowMore,
                            'col-md-6 pr-0 pl-0' : isShowMore
                        })}>
                            <div className="input-group-app search tabled">
                                <Form
                                    onSubmit={(values) => this.handleSearchByAccount(values)}
                                    render={({
                                                submitForm, values, addValue, removeValue, setValue, getFormState
                                            }) => (
                                            <form
                                                className="iconned-input-field"
                                                onSubmit={submitForm}
                                            >
                                                <AccountRS
                                                    field={'seller'}
                                                    setValue={setValue}
                                                    noContactList
                                                    placeholder="Seller's Account ID"
                                                />
                                                <button className="search-icon">
                                                    <i className="zmdi zmdi-search" />
                                                </button>
                                            </form>
                                        )}
                                />

                            </div>
                        </div>
                        <div className={classNames({
                            'col-md-12 pr-0 pl-0' : !isShowMore,
                            'col-md-6 pr-0 pl-0' : isShowMore
                        })}>
                            <div className="input-group-app search tabled">
                                <Form
                                    onSubmit={(values) => this.handleSearchByTag(values)}
                                    render={({
                                                submitForm, values, addValue, removeValue, setValue, getFormState
                                            }) => (
                                            <form
                                                className="iconned-input-field"
                                                onSubmit={submitForm}
                                            >
                                                <Text field="tag" placeholder="Title, description or Tag" />

                                                <button className="search-icon">
                                                    <i className="zmdi zmdi-search" />
                                                </button>
                                            </form>
                                        )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="filters-bar" ref={'filtersBar'}>
                    {
                        this.state.getDGSTags &&
                        this.state.getDGSTags.map((el, index) => {
                            return (
                                <Link key={uuid()} to={'/marketplace/' + el.tag} className="btn filter btn-xs">{el.tag}&nbsp;[{el.totalCount}]</Link>
                            );
                        })
                    }
                    <button
                        type={'button'}
                        className="btn btn-green btn-sm"
                        onClick={showMoreController}
                        dangerouslySetInnerHTML={{__html: isShowMore ? 'View less' : 'View more'}}
                    />
                    {this.state.getDGSTags && isShowMore && (
                        <div
                            ref={'btnBox'}
                            className="btn-box pagination"
                        >
                            <button
                                type={'button'}
                                className={classNames({
                                    'btn btn-default': true,
                                    'disabled': this.state.page <= 1,
                                })}
                                onClick={this.onPaginate.bind(this, this.state.page - 1)}
                            >
                                Previous
                            </button>
                            <div className='pagination-nav'>
                                <span>{this.state.page * this.state.itemsPerPage - this.state.itemsPerPage + 1}</span>
                                <span>&hellip;</span>
                                <span>{(this.state.page * this.state.itemsPerPage - this.state.itemsPerPage) + this.state.getDGSTags.length}</span>
                            </div>
                            <button
                                type={'button'}
                                onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                className={classNames({
                                    'btn btn-default': true,
                                    'disabled': this.state.getDGSTags.length < this.state.itemsPerPage
                                })}
                            >
                                Next
                            </button>
                        </div>
                        )}
                </div>
            </div> 
        );
    }
}

const mapDispatchToProps = dispatch => ({
    getDGSTagsAction: (reqParams) => dispatch(getDGSTagsAction(reqParams)),
});


export default connect(null, mapDispatchToProps)(withRouter(MarketplaceTags))