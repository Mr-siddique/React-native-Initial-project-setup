import React, {Component} from 'react';
import {Text, View} from 'react-native';
import { makeFirstCall } from '../Redux/firstCall';
import { connect } from 'react-redux';
class TestPageOne extends Component {
  componentDidMount(){
    this.props.makeFirstCall()
  }
  render() {
    console.log(">>props",this.props)
    // eslint-disable-next-line react-native/no-inline-styles
    return <View style={{height: 200, width: 200, backgroundColor: 'green'}} >
      <Text>Initial Setup done</Text>
    </View>;
  }
}

export default connect(
  state => ({
    first_call_loading: state.firstcall.first_call_loading,
    first_call_data: state.firstcall.first_call_data,
    first_call_success: state.firstcall.first_call_success,
  }),
  {
   makeFirstCall
  },
  null
)(TestPageOne);