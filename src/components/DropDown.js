import AppStyles from '../styles/AppStyles';

import React, { FC, ReactElement, useRef, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


const DropDown = ({ label, data, onSelect, dropdownStyle, labelStyle }) => {
    const DropdownButton = useRef();
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [dropdownTop, setDropdownTop] = useState(300);

    const toggleDropdown = () => {
        visible ? setVisible(false) : openDropdown();
    };

    const openDropdown = () => {
        DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
            setDropdownTop(py + h);
        });
        setVisible(true);
    };

    const onItemPress = (item) => {
        setSelected(item);
        onSelect(item);
        setVisible(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
            <Text style={{fontSize:12}}>{item.label}</Text>
        </TouchableOpacity>
    );

    const styles = StyleSheet.create({
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#efefef',
            height: 50,
            zIndex: 1,
        },
        buttonText: {
            flex: 1,
            textAlign: 'center',
        },
        icon: {
            marginRight: 10,
        },
        dropdown: {
            position: 'absolute',
            backgroundColor: '#fff',
            width: "90%",
            shadowColor: '#000000',
            shadowRadius: 4,
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: 0.1,
        },
        overlay: {
            width: '100%',
            height: '100%',
            justifyContent: "center",
            alignItems: "center"
        },
        item: {
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderBottomWidth: 0.2,
        },
    });

    const renderDropdown = () => {
        return (
            <Modal visible={visible} transparent animationType="none">
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}
                >
                    <View style={[styles.dropdown, { top: dropdownTop }]}>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    return (
        <TouchableOpacity
            ref={DropdownButton}
            style={dropdownStyle}
            onPress={toggleDropdown}
        >
            <View style={{ flexDirection: "row" }}>
                {renderDropdown()}
                <Text style={[{ flex: 1 }, labelStyle]}>
                    {(!!selected && selected.label) || label}
                </Text>
                <View style={{ marginTop: 5 }}>
                    <MaterialIcons name="keyboard-arrow-down" size={14} color="black" />
                </View>
            </View>
        </TouchableOpacity>
    );
};


export default DropDown;