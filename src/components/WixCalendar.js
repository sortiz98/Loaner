import React from 'react';

import { View, Text, Pressable, StyleSheet, Modal, Alert, TouchableOpacity, FlatList, ScrollView } from 'react-native'; // 0.0.1

import { CalendarList } from 'react-native-calendars'; // 1.16.1

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMarkedDates } from '../redux/actions';

import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import BlockTimeCard from '../components/BlockTimeCard';
import AppStyles from '../styles/AppStyles';

import { getFirestore, collection, collectionGroup, getDocs, getDoc, query, where, setDoc, doc } from "firebase/firestore";
import { db, storage, auth } from "../firebase-config";
import Checkbox from 'expo-checkbox';
import { KnownDirectivesRule } from '../../node_modules/graphql/index';
import { getDateString } from '../components/HelperFunctions';

const today = new Date();//2022, 6, 11);
const maxDate = new Date();
maxDate.setFullYear(today.getFullYear() + 1);
maxDate.setMonth(today.getMonth() - 1);

class WixCalendar extends React.Component {

    constructor({ navigation, modalText, updateDataFunction, calendarData, longDayEnabled }) {
        super({ navigation, modalText, updateDataFunction, calendarData, longDayEnabled });

        this.navigation = navigation;
        this.modalText = modalText;
        this.updateDataFunction = updateDataFunction;
        this.calendarData = calendarData;
        this.longDayEnabled = longDayEnabled;
        this.daysOfWeekToString = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "" }
       
        this.blockStyle = {
            customStyles: {
                container: {
                    backgroundColor: '#BEBEBE',
                    borderRadius: 0
                }
            }
        }

        this.semiBlockStyle = {
            customStyles: {
                container: {
                    backgroundColor: '#ECECEC',
                    borderRadius: 0
                }
            }
        }

        this.unblockStyle = {
            customStyles: {
                container: {
                    backgroundColor: '#fff',
                    borderRadius: 0
                }
            }
        }

        let dates = {};
        for (const [date, value] of Object.entries(this.calendarData.markedDates)) {
            console.log("DATE");
            console.log(date);
            if (value == "full") {
                dates[date] = this.blockStyle;
            } else {
                dates[date] = this.semiBlockStyle;
            }
        }

        this.state = {
            markedDates: dates,
            modalVisible: false,
            blockList: [],
            blockAllDay: false,
            selectedDay: { dayOfWeek: 7 },
            recurringBlocks: {},
            visibleMonths: {}
        }

        this.fillMarkedDates();

        //this.readItemCalendar();
       
    }

    //readItemCalendar = async () => {
    //    await getDoc(this.calendarDoc)
    //        .then((snapshot) => {
    //            if (snapshot.exists && snapshot.data()) {
    //                this.calendarData = snapshot.data();
    //                this.fillMarkedDates();
    //                this.updateDataFunction(this.calendarData);
    //            } else {
    //                this.calendarData = { dateTimeBlocks: {}, weekly: {}, markedDates: {} };
    //            }
    //        })
    //        .catch((error) => { console.log(error.message) });
    //}


    fillMarkedDates = async () => {

        for (const [day, value] of Object.entries(this.calendarData.weekly)) {
            if (value == "full") {
                await this.updateReccuringBlocks(day, this.blockStyle);
            } else {
                await this.updateReccuringBlocks(day, this.semiBlockStyle);
            }
        }
        this.markDaysInVisibleMonths();
    }


    addBlockOrBlocks = async (blocks = null) => {
        if (blocks == null) { blocks = [{ key: Date.now(), state: { startTime: { hour: 0, minute: 0 }, endTime: { hour: 0, minute: 0 }, recur: false } }]; }
        await this.setBlockList(this.state.blockList.concat(blocks));
    }

    setBlockList = (list) => {
        if (list.length == 0) { list = [{ key: Date.now(), state: { startTime: { hour: 0, minute: 0 }, endTime: { hour: 0, minute: 0 }, recur: false } }];}
        this.setState({ blockList: list });
    }

    updateReccuringBlocks = async (day, style = null) => {
        const copy = { ...this.state.recurringBlocks };
        if (style) {
            copy[day] = style;
        } else {
            delete copy[day];
        }
        await this.setState({ recurringBlocks: copy });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    setVisibleMonths = (firstMo, yr, num) => {
        this.setState({ visibleMonths: { firstMonth: firstMo, year: yr, numMonths: num } });
    }

    setBlockAllDay = (block) => {
        this.setState({ blockAllDay: block });
    }

    setSelectedDay = (dayOfWeekValue, dateStringValue) => {
        this.setState({ selectedDay: { dayOfWeek: dayOfWeekValue, dateString: dateStringValue } });
    }

    setTime = (val) => {
        this.setState({ time: val });
    }

    setOpen = (openBool) => {
        this.setState({ open: openBool });
    }

    markSelectedDate = (day, customStyle, reverse = true) => {
        const selectedDay = day;
     
        //let marked = true;

        // Create a new object using object property spread since it should be immutable

        const updatedMarkedDates = { ...this.state.markedDates, ...{ [selectedDay]: customStyle } };

        // Triggers component to render again, picking up the new state

        this.setState({ markedDates: updatedMarkedDates });
    }

    onDaySelect = (day) => {
        const dateString = day.dateString;
        const month = parseInt(day.month) - 1;
        let style = this.blockStyle;
        let mark = true;
        if (this.state.markedDates[dateString]) {
            const color = this.state.markedDates[dateString].customStyles.container.backgroundColor;
            if (color == '#BEBEBE') {
                style = this.unblockStyle;
                mark = false;
            }
        }
        this.markSelectedDate(dateString, style);
        if (mark) {
            this.calendarData.markedDates[dateString] = "full";
        } else {
            delete this.calendarData.markedDates[dateString];
        }
        this.updateDataFunction(this.calendarData);
    }

    onDayLongSelect = async (day) => {
        const dateString = day.dateString;
        let date = new Date(day.year, day.month - 1, day.day);
        let dayOfWeek = await date.getDay();
        this.setSelectedDay(dayOfWeek, dateString);

        const newBlockList = [];
        if (dayOfWeek in this.calendarData.weekly) {
            if (this.calendarData.weekly[dayOfWeek] == "full") {
                this.setBlockAllDay(true);
            } else {
                this.setBlockAllDay(false);
                for (const [blockId, stateValue] of Object.entries(this.calendarData.weekly[dayOfWeek])) {
                    let stateCopy = { ...stateValue };
                    stateCopy.recur = true;
                    newBlockList.push({ key: blockId, state: stateCopy });
                }
            }
        } 
        if (dateString in this.calendarData.dateTimeBlocks) {
            this.calendarData.dateTimeBlocks[dateString].forEach((item) => {
                item.state.recur = false;
                newBlockList.push({ key: item.key, state: item.state });
            })
        }
        this.setBlockList(newBlockList);
        this.setModalVisible(true)
    }

    closeBlockTimeModal = async () => {
        const dayOfWeek = this.state.selectedDay.dayOfWeek;
        if (this.state.blockAllDay) {
            this.calendarData.weekly[dayOfWeek] = "full";
            await this.updateReccuringBlocks(dayOfWeek, this.blockStyle);
            delete this.calendarData.dateTimeBlocks[dateString];
            this.updateDataFunction(this.calendarData);
            this.markDaysInVisibleMonths();
            this.setBlockAllDay(false);
            this.setModalVisible(false);
            return;
        }
        this.calendarData.weekly[dayOfWeek] = {};
        let semiBlockRecur = false;
        let semiBlockedList = [];
        const dateString = this.state.selectedDay.dateString;
   
        this.state.blockList.forEach((item) => {
            const recur = item.state.recur;
            const startTime = item.state.startTime;
            const endTime = item.state.endTime;
            delete item["recur"];
            if (recur) {
                if (dayOfWeek in this.calendarData.weekly) {
                    this.calendarData.weekly[dayOfWeek][item.key] = item.state;
                    semiBlockRecur = true;
                } else {
                    let weekData = {};
                    weekData[item.key] = item.state;
                    this.calendarData.weekly[dayOfWeek] = weekData;
                }
            } else if (startTime.hour != endTime.hour || startTime.minute != endTime.minute) {
                semiBlockedList.push(item);
            }
        })
        if (semiBlockedList.length == 0) {
            this.markSelectedDate(dateString, this.unblockStyle);
            delete this.calendarData.dateTimeBlocks[dateString];
            delete this.calendarData.markedDates[dateString];
        } else {
            this.markSelectedDate(dateString, this.semiBlockStyle);
            this.calendarData.dateTimeBlocks[dateString] = semiBlockedList;
            this.calendarData.markedDates[dateString] = "semi";
        }
        if (semiBlockRecur) {
            await this.updateReccuringBlocks(dayOfWeek, this.semiBlockStyle);
        } else if (dayOfWeek in this.calendarData.weekly){
            delete this.calendarData.weekly[dayOfWeek];
            await this.updateReccuringBlocks(dayOfWeek);
        }
        this.markDaysInVisibleMonths();
        this.updateDataFunction(this.calendarData);
        this.setModalVisible(false);
    }

    onVisibleMonthsChange = async (objects) => {
        let months = [];
        let years = [];
        objects.forEach((obj) => {
            months.push(parseInt(obj["month"]));
            years.push(parseInt(obj["year"]));
        })
        const month = Math.min(...months) - 1;
        const year = Math.min(...years);
        await this.setVisibleMonths(month, year, months.length);
        this.markDaysInVisibleMonths();
        //this.setState({ markedDates: days });
    }

    markDaysInVisibleMonths = () => {
        let visibleMonths = this.state.visibleMonths;
        let pivot = new Date(visibleMonths.year, visibleMonths.firstMonth, 1);
        let end = new Date(visibleMonths.year, visibleMonths.firstMonth + visibleMonths.numMonths, 0);
        if ((end - maxDate) > 0) {
            end = maxDate;
        }
       
        let increments = {};
        const pivotDay = pivot.getDay();
        for (const [day, style] of Object.entries(this.state.recurringBlocks)) {
            increments[this.getDayIncrement(pivotDay, day)] = style;
        } 
        
        let dates = {};
        let day = new Date();

        while ((end - pivot) >= 0) {
            for (const [increment, style] of Object.entries(increments)) {
                day = this.addDays(pivot, increment);
                if (day.getMonth() != today.getMonth() || day.getDate() >= today.getDate()) {
                    const dateString = getDateString(day);
                    dates[dateString] = style;
                    console.log(dateString);
                }
            }
            pivot = this.addDays(pivot, 7);
        }

        const updatedMarkedDates = { ...this.state.markedDates, ...dates };
        console.log("UPD");
        console.log(updatedMarkedDates);

        this.setState({ markedDates: updatedMarkedDates });

        //return updatedMarkedDates
    }

    addDays = (date, num_days) => {
        let copy = new Date(date.valueOf());
        copy.setDate(date.getDate() + parseInt(num_days));
        return copy
    }

    getDayIncrement = (current, desired) => {
        const diff = desired - current
        if (desired < current) {
            return 7 + diff
        } else {
            return diff
        }
    }

    styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },
        button: {
            borderRadius: 20,
            padding: 10,
            elevation: 2
        },
        buttonOpen: {
            backgroundColor: "#F194FF",
        },
        buttonClose: {
            backgroundColor: "#2196F3",
        },
        textStyle: {
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
        },
        modalText: {
            marginBottom: 15,
            textAlign: "center"
        }
    });

    addBlockTimeButton = () => {
        return (
            <TouchableOpacity style={{ marginTop: 15, alignSelf: "flex-end" }} onPress={() => { this.addBlockOrBlocks(); }}>
                <View style={{ flexDirection: "row", marginLeft: 6, marginTop: 6 }}>
                    <View style={{
                        borderBottomColor: "#EE1818",
                        borderTopColor: "#EE1818",
                        borderLeftColor: "#EE1818",
                        borderRightColor: "#EE1818",
                        borderTopWidth: 1.5,
                        borderBottomWidth: 1.5,
                        borderLeftWidth: 1.5,
                        borderRightWidth: 1.5,
                        borderRadius: 100,
                        width: 25,
                        height: 25
                    }}></View>
                    <Text style={{ fontSize: 18, marginLeft: -19.5, marginTop: -3, color: "#EE1818" }}>+</Text>
                    <Text style={{ fontSize: 12, marginLeft: 15, marginTop: 3, color: "#EE1818", fontWeight: "bold" }}>Add time block</Text>
                </View>
            </TouchableOpacity>
        );
    }


    updateBlock = (blockId, updateType, value = null) => {
        const dayOfWeek = this.state.selectedDay.dayOfWeek;
        const dateString = this.state.selectedDay.dateString;
        switch (updateType) {
            case "startTime":
                this.state.blockList.some(function (block, i, arr) {
                    if (block.key == blockId) {
                        arr[i].state.startTime.hour = value.getHours();
                        arr[i].state.startTime.minute = value.getMinutes();
                        return true;
                    }
                })
                break;
            case "endTime":
                this.state.blockList.some(function (block, i, arr) {
                    if (block.key == blockId) {
                        arr[i].state.endTime.hour = value.getHours();
                        arr[i].state.endTime.minute = value.getMinutes();
                        return true;
                    }
                })
                break;
            case "recur":
                this.state.blockList.some(function (block, i, arr) {
                    if (block.key == blockId) {
                        arr[i].state.recur = value;
                        return true;
                    }
                })
                break;
            case "delete":
                const copy = this.state.blockList.concat([])
                this.state.blockList.some(function (block, i) {
                    if (block.key == blockId) {
                        copy.splice(i, 1);
                        return true;
                    }
                })
                this.setState({ blockList: copy });

                if (dayOfWeek in this.calendarData.weekly) {
                    if (blockId in this.calendarData.weekly[dayOfWeek]) {
                        delete this.calendarData.weekly[dayOfWeek][blockId];
                    }
                }
                break;
            default:
                print("Invalid Update Type");
        }
    }

    addView = ({ item }) => {
        return (
            <View>
                { item.key != "button" && <BlockTimeCard state={item.state} dayOfWeek={this.daysOfWeekToString[this.state.selectedDay.dayOfWeek]} updateBlockFunction={this.updateBlock.bind(this)} blockId={item.key} />}
                { item.key == "button" && this.addBlockTimeButton()}
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}
                >
                    <View style={{flex:1}}>
                        <View style={AppStyles.modalView}>
                            <TouchableOpacity style={[AppStyles.imageButton, AppStyles.leftAligned]} onPress={this.closeBlockTimeModal}>
                                <Ionicons name="close" color="#000" size={20} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 12.5, fontWeight: "bold", marginTop: -45, color: "#000" }}>Time Block</Text>
                            <Text style={{ fontSize: 12, marginTop: 15, color: "#514F4F" }}>{this.modalText}</Text>
                            <Text style={{ fontSize: 11.5, fontWeight: "bold", marginTop: 20, color: "#000", alignSelf: "flex-start" }}>Unavailable...</Text>
                            <View style={{ flexDirection: "row", marginTop: 15, alignSelf: "flex-start" }}>
                                <Checkbox
                                    style={[{ width: 15, height: 15, borderWidth: 1 }]}
                                    value={this.state.blockAllDay}
                                    onValueChange={this.setBlockAllDay}
                                    color={"#EE1818"}
                                />
                                <Text style={{ fontSize: 11, marginLeft: 10, color: "#EE1818" }}>{"All Day Every " + this.daysOfWeekToString[this.state.selectedDay.dayOfWeek]}</Text>
                            </View>
                            <View style={[AppStyles.fullLine, AppStyles.topMargin]}></View>
                            <View style={{alignSelf:"center", flex:1}}>
                                <FlatList
                                    data={this.state.blockList.concat([{key:"button"}])}
                                    renderItem={this.addView}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

                <CalendarList
                    markingType={'custom'}
                    minDate={getDateString(today)}
                    maxDate={getDateString(maxDate)}
                    pastScrollRange={0}
                    futureScrollRange={11}
                    onDayPress={this.onDaySelect}
                    onDayLongPress={this.longDayEnabled ? this.onDayLongSelect : ((day) => { console.log("LONG DAY DISABLED") }) }
                    markedDates={this.state.markedDates}
                    onVisibleMonthsChange={this.onVisibleMonthsChange}
                    theme={{ 'stylesheet.day.basic': { today: { borderRadius: 0 }, todayText: {color: "#000"}, base: { borderWidth: 0.3, alignItems: 'center', justifyContent: 'center', flex: 1, minWidth: 43, minHeight: 43 } } }}
                />
          </View>
        );
    }
}


const mapStateToProps = (state) => {
    const { markedDates } = state
    return { markedDates }
};


const mapDispatchToProps = dispatch => (
    bindActionCreators({
        setMarkedDates,
    }, dispatch)
);

//export default connect(mapStateToProps, mapDispatchToProps)(WixCalendar);
export default WixCalendar

