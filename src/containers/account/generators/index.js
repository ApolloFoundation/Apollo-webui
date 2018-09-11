import React from "react";
import {connect} from "react-redux";
import SiteHeader from "../../components/site-header";
import Block from "../blocks/block";
import classNames from "classnames";
import {getGeneratorsAction} from "../../../actions/generators";
import {formatTimestamp} from "../../../helpers/util/time";
import Generator from "../../../actions/generators/generator";

class Generators extends React.Component {

    state = {
        generators: [],
        lastBlockTime: "",
        height: "",
        timestamp: 0,
        activeForgers: 0,
    };

    formDate = date => {
        if (!date) return "";
        const lastUpdDate = new Date(Date.now() - date);
        const month = lastUpdDate.getMonth();
        const day = lastUpdDate.getDay();
        const year = lastUpdDate.getFullYear();
        const time = lastUpdDate.getHours() + ":" + lastUpdDate.getMinutes() + ":" + lastUpdDate.getSeconds();
        return `${month}/${day}/${year} ${time}`;
    };

    componentDidMount = () => {
        this.getGenerators();
    };

    getGenerators = () => this.props.getGeneratorsAction()
        .then(generators => this.setState({
            generators: generators.generators,
            lastBlockTime: this.props.formatTimestamp(generators.timestamp),
            height: generators.height,
            activeForgers: generators.activeCount,
            timestamp: generators.timestamp
        }));

    render() {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Generators'}
                />
                <div className="page-body container-fluid">
                    <div className="blocks">
                        <div className="row">
                            <div className="col-md-6 col-lg-3">
                                <div className="card header ballance single">
                                    <div className="card-title">Last Block</div>
                                    <div className="amount">{this.state.lastBlockTime}</div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3">
                                <div className="card header assets single">
                                    <div className="card-title">Height</div>
                                    <div className="amount">{this.state.height}</div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-3">
                                <div className="card header currencies single">
                                    <div className="card-title">Active Forgers</div>
                                    <div className="amount">{this.state.activeForgers}</div>
                                </div>
                            </div>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead>
                                    <tr>
                                        <td className="align-left">Account</td>
                                        <td className="align-right">Effective Balance</td>
                                        <td className="align-left">Hit Time</td>
                                        <td className="align-right">Deadline</td>
                                        <td className="align-right">Remaining</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.generators.map(el => {
                                            return (
                                                <Generator
                                                    generator={el}
                                                    resTimestamps={this.state.timestamp}
                                                    epochB={this.props.epochB}
                                                />
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    epochB: state.account.constants.epochBeginning,
});

const mapDispatchToProps = dispatch => ({
    getGeneratorsAction: () => dispatch(getGeneratorsAction()),
    formatTimestamp: time => dispatch(formatTimestamp(time))
});

export default connect(mapStateToProps, mapDispatchToProps)(Generators);