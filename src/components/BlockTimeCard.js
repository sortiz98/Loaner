import React, { Component } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity, CheckBox } from "react-native";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AppStyles from '../styles/AppStyles';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Checkbox from 'expo-checkbox';


class BlockTimeCard extends Component {

    constructor({state, dayOfWeek, updateBlockFunction, blockId}) {
      
        super({ state, dayOfWeek, updateBlockFunction, blockId })

        this.updateBlockFunction = updateBlockFunction
        this.blockId = blockId
        this.dayOfWeek = dayOfWeek

        let initialStartTime = new Date();
        let initialEndTime = new Date();

        initialStartTime.setHours(state.startTime.hour);
        initialStartTime.setMinutes(state.startTime.minute);

        initialEndTime.setHours(state.endTime.hour);
        initialEndTime.setMinutes(state.endTime.minute);

        this.state = {
            openStartTimeModal: false,
            startTime: initialStartTime,
            openEndTimeModal: false,
            endTime: initialEndTime,
            recurSelected: state.recur
        }

    }

    setRecurSelected = (selected) => {
        this.setState({ recurSelected: selected });
        this.updateBlockFunction(this.blockId, "recur", selected)
    }


    setStartTime = (time) => {
        this.setState({ startTime: time });
        if (time.getTime() > this.state.endTime.getTime()) {
            this.setState({ endTime: time });
            this.updateBlockFunction(this.blockId, "endTime", time)
        }
        this.updateBlockFunction(this.blockId, "startTime", time)
    }

    setOpenStartTimeModal = (open) => {
        this.setState({ openStartTimeModal: open });
    }

    setEndTime = (time) => {
        this.setState({ endTime: time });
        if (time.getTime() < this.state.startTime.getTime()) {
            this.setState({ startTime: time });
            this.updateBlockFunction(this.blockId, "startTime", time)
        }
        this.updateBlockFunction(this.blockId, "endTime", time)
    }

    setOpenEndTimeModal = (open) => {
        this.setState({ openEndTimeModal: open });
    }

    onStartConfirm = (time) => {
        this.setStartTime(time)
        this.setOpenStartTimeModal(false)
    }

    onEndConfirm = (time) => {
        this.setEndTime(time)
        this.setOpenEndTimeModal(false)
    }

    timeSpinner = (time) => {
        return (
            <View style={{ flexDirection: "row" }}>
                <View style={{
                    borderBottomColor: "#BEBEBE",
                    borderTopColor: "#BEBEBE",
                    borderLeftColor: "#BEBEBE",
                    borderRightColor: "#BEBEBE",
                    borderTopWidth: 0.7,
                    borderBottomWidth: 0.7,
                    borderLeftWidth: 0.7,
                    borderRightWidth: 0.7,
                    borderRadius: 3,
                    width: 120,
                    height: 35
                }}></View>
                
                <View style={{
                    height: 34,
                    borderLeftWidth: 0.7,
                    borderLeftColor: '#BEBEBE',
                    marginLeft:-18
                }}></View>
                <View style={{ flexDirection: "column", marginTop: 3 }}>
                    <MaterialIcons name="keyboard-arrow-up" color="#777777" size={15} />
                    <MaterialIcons name="keyboard-arrow-down" color="#777777" size={15} />
                </View>
                <Text style={{ fontSize: 13, marginTop: 6, marginLeft: -65-(5 * time.length), marginRight: 32, color: "#514F4F" }}>{time}</Text>
            </View>
        );
    }

    //labeledCheckBox = (isSelectedFunc, isSelected, label) => {
    //    return (
    //        <View style={{ flexDirection: "row", marginLeft: 10, marginRight: 10}}>
    //            <Checkbox
    //                style={[{ width: 15, height: 15, borderWidth: 1 }]}
    //                value={isSelected}
    //                onValueChange={isSelectedFunc}
    //                color={"#EE1818"}
    //            />
    //            <Text style={{fontSize:9, marginLeft:5}}>{label}</Text>
    //        </View>
    //    );
    //}

    //displayWeekdayOptions = () => {
    //    return (
    //        <View style={{ flexDirection: "row", marginTop: 25, marginLeft: -15, justifyContent: "center", alignItems: "center" }}>
    //            {this.labeledCheckBox(this.setSunSelected, this.state.sunSelected, "S")}
    //            {this.labeledCheckBox(this.setMonSelected, this.state.monSelected, "M")}
    //            {this.labeledCheckBox(this.setTueSelected, this.state.tueSelected, "T" )}
    //            {this.labeledCheckBox(this.setWedSelected, this.state.wedSelected, "W" )}
    //            {this.labeledCheckBox(this.setThuSelected, this.state.thuSelected, "T" )}
    //            {this.labeledCheckBox(this.setFriSelected, this.state.friSelected, "F" )}
    //            {this.labeledCheckBox(this.setSatSelected, this.state.satSelected, "S" )}
    //        </View >
    //    );
    //}
    
    render() {
        return (
            <View style={{ flexDirection: "column", marginTop: 15 }}>
                <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { this.updateBlockFunction(this.blockId, "delete") } }>
                    <Ionicons name="close" color="#EE1818" size={18} />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginLeft:-15 }}>
                    <TouchableOpacity onPress={() => this.setOpenStartTimeModal(true)}>
                        {this.timeSpinner(this.state.startTime.toLocaleString('en-US', { hour: 'numeric', minute:'numeric', hour12: true }))}
                    </TouchableOpacity>
                    <Text style={[AppStyles.blackText, AppStyles.leftMargin20, AppStyles.rightMargin20]}>to</Text>
                    <TouchableOpacity onPress={() => this.setOpenEndTimeModal(true)}>
                        {this.timeSpinner(this.state.endTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))}
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", marginTop: 18, marginRight: 10 }}>
                    <Checkbox
                        style={[{ width: 15, height: 15, borderWidth: 1 }]}
                        value={this.state.recurSelected}
                        onValueChange={this.setRecurSelected}
                        color={"#EE1818"}
                    />
                    <Text style={{ fontSize: 10, marginLeft: 10 }}>{"Every " + this.dayOfWeek}</Text>
                </View>

                <View style={[AppStyles.fullLine, AppStyles.topMargin]}></View>
                <DateTimePickerModal
                    isVisible={this.state.openStartTimeModal}
                    mode="time"
                    onConfirm={this.onStartConfirm}
                    onCancel={() => { this.setOpenStartTimeModal(false)}}
                />
                <DateTimePickerModal
                    isVisible={this.state.openEndTimeModal}
                    mode="time"
                    minimumDate={this.state.startTime}
                    onConfirm={this.onEndConfirm}
                    onCancel={() => { this.setOpenEndTimeModal(false) }}
                />
            </View>
        );
    }
}

export default BlockTimeCard

