import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    openingContainer: {
        flex: 1,
        backgroundColor: '#3F5385',
        alignItems: 'center',
        justifyContent: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        textAlign: "center"
    },
    centerText: {
        textAlign: "center"
    },
    horizontalPadding20: {
        paddingHorizontal: 20
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    editModalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flex: 1
    },
    whiteBackground: {
        alignSelf: 'stretch',
        backgroundColor: '#ffffff'
    },
    line: {
        width: 350,
        borderBottomWidth: 0.4,
        borderBottomColor: '#A8A8A8'
    },
    fullLine: {
        width: 400,
        borderBottomWidth: 0.4,
        borderBottomColor: '#A8A8A8'
    },
    lineTop: {
        width: 350,
        borderBottomWidth: 0.3,
        borderBottomColor: '#A8A8A8'
    },
    buttonOutline: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 100,
        elevation: 5,
        width: 350,
        backgroundColor: '#3F5385',
        borderColor: '#fff',
        borderWidth: 2
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 100,
        elevation: 5,
        width: 350,
        backgroundColor: '#fff'
    },
    imageButton: {
        width: 58,
        height: 60
    },
    buttonBlue: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 5,
        elevation: 5,
        width: 350,
        backgroundColor: '#506BAE'
    },
    inactiveRateOptionButton: {
        borderRadius: 1,
        borderColor: 'rgba(0, 0, 0, 0.6)',
        borderWidth: 0.8,
        width: 330,
        height: 50,
        backgroundColor: '#fff'
    },
    activeRateOptionButton: {
        borderRadius: 1,
        borderColor: "#506BAE",
        borderWidth: 1,
        width: 330,
        height: 50,
        backgroundColor: 'rgba(80, 107, 174, 0.2)'
    },
    listingOptionButton: {
        borderRadius: 1,
        borderColor: "#506BAE",
        borderWidth: 1,
        alignSelf: 'stretch',
        height: 50,
        backgroundColor: 'rgba(80, 107, 174, 0.2)'
    },
    activeBubbleButton: {
        borderRadius: 10,
        borderColor: "#506BAE",
        borderWidth: 0.5,
        width: 330,
        height: 120,
        backgroundColor: 'rgba(80, 107, 174, 0.2)'
    },
    inactiveBubbleButton: {
        borderRadius: 10,
        borderColor: 'rgba(0, 0, 0, 0.6)',
        borderWidth: 0.3,
        width: 330,
        height: 120,
        backgroundColor: '#fff'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    noPadding: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "red"
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        marginVertical: 4,
    },
    fillSpace: {
        flex: 1
    },
    topMargin: {
        marginTop: 16
    },
    topMargin8: {
        marginTop: 8
    },
    topMarginSmall: {
        marginTop: 6
    },
    topMargin10: {
        marginTop: 10
    },
    topMargin11: {
        marginTop: 11
    },
    activeColor: {
        color: '#506BAE',
        borderBottomColor: '#506BAE'
    },
    inactiveColor: {
        color: '#A8A8A8',
        borderBottomColor: '#A8A8A8'
    },
    postProgressTab: {
        width: 55,
        borderBottomWidth: 3.9,
        borderRadius: 10,
        marginTop: 10.5,
        marginBottom:8
    },
    halfPostProgressTab: {
        width: 27.5,
        borderBottomWidth: 3.9,
        marginTop: 10.5,
        marginBottom: 8
    },
    roundedRightCorners: {
        borderBottonLeftRadius: 0,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 10
    },
    roundedLeftCorners: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 0
    },
    imagePlaceholder: {
        width: 115,
        height: 115,
        resizeMode: 'cover'
    },
    imageThumbnail: {
        width: ((windowWidth - 20) / 3) * .95,
        height: ((windowWidth - 20) / 3) * .95,
        resizeMode: 'cover',
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    imagePreview: {
        width: 105,
        height: 105,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 5
    },
    postProgressText: {
        fontSize: 7.7,
        fontWeight: 'bold',
        paddingHorizontal: 5
    },
    topMarginMedium: {
        marginTop: 26
    },
    topMargin90: {
        marginTop: 90
    },
    topMargin50: {
        marginTop: 50
    },
    topMargin35: {
        marginTop: 35
    },
    topMargin120: {
        marginTop: 199
    },
    topMarginLarge: {
        marginTop: 185,
        marginBottom:-130
    },
    bottomMargin: {
        marginBottom: 16
    },
    bottomMarginSmall: {
        marginBottom: 6
    },
    bottomMargin8: {
        marginBottom: 8
    },
    bottomMargin10: {
        marginBottom: 10
    },
    bottomMargin35: {
        marginBottom: 35
    },
    bottomMarginMedium: {
        marginBottom: 26
    },
    bottomMarginLarge: {
        marginBottom: 130,
        marginTop:0
    },
    rightMargin: {
        marginRight: 16
    },
    leftMargin: {
        marginLeft: 16
    },
    rightMargin20: {
        marginRight: 20
    },
    leftMargin20: {
        marginLeft: 20
    },
    leftMarginLarge: {
        marginLeft: 219,
    },
    backgroundCover: {
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3F5385',
        opacity: 0.7,
        padding: 16
    },
    calendarCover: {
        marginBottom: 10,
        marginTop: 10,
        height: 430,
        marginLeft: -5,
        marginRight: -5
    },
    searchCalendarCover: {
        marginBottom: 10,
        marginTop: 20,
        height: windowHeight * 0.56,
        marginLeft: -5,
        marginRight: -5
    },
    lightText: {
        color: "#fff"
    },
    lightMediumText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    },
    darkMediumText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold"
    },
    darkBoldText: {
        color: "#000",
        fontSize: 12,
        fontWeight: "bold"
    },
    modalView: {
        marginTop: 80,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 18,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -100
        },
        alignItems: "center",
        shadowOpacity: 0.5,
        shadowRadius: 0,
        elevation: 5,
        width: 390,
        height: 740
    },
    darkSemiBoldText: {
        color: "#000",
        fontSize: 11,
        fontWeight: "500"
    },
    leftAligned: {
        alignSelf: "flex-start"
    },
    lightHeaderText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20
    },
    darkHeaderText: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 20
    },
    darkHeaderText18: {
        color: "#000000",
        fontWeight: "bold",
        fontSize: 18
    },
    darkText: {
        color: "#777777",
        fontSize: 11
    },
    darkText13: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 13
    },
    darkText12: {
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: 12
    },
    blackText: {
        color: "#000000",
        fontSize: 12
    },
    smallDarkText: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: 10
    },
    buttonText: {
        color: "#3F5385",
        fontSize: 10,
        fontWeight: "bold"
    },
    buttonLightText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold"
    },
    buttonOutlineText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold"
    },
    errorText: {
        color: "#ff0000"
    },
    header: {
        fontSize: 20,
        alignSelf: "center"
    },
    textInput: {
        alignSelf: 'stretch',
        padding: 8,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        marginVertical: 8
    },
    thinTextInput: {
        alignSelf: 'stretch',
        padding: 7,
        borderBottomWidth: 0.3,
        borderTopWidth: 0.3,
        borderLeftWidth: 0.3,
        borderRightWidth: 0.3,
        marginVertical: 8,
        borderRadius: 2
    },
    searchTextInput: {
        alignSelf: 'stretch',
        padding: 13,
        borderBottomWidth: 0.3,
        borderTopWidth: 0.3,
        borderLeftWidth: 0.3,
        borderRightWidth: 0.3,
        borderRadius: 25,
        marginHorizontal: 10
    },
    lineTextInput: {
        padding: 12,
        borderBottomWidth: 1,
        width: 90,
        marginBottom: 8,
    },
    rateTextInput: {
        alignSelf: 'stretch',
        padding: 7,
        borderBottomWidth: 0.3,
        borderTopWidth: 0.3,
        borderLeftWidth: 0.3,
        borderRightWidth: 0.3,
        marginVertical: 12,
        borderRadius: 5,
        width: 150
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 50,
        backgroundColor: "#000",
        marginLeft: 15,
        marginRight: 15
    },
    greenTag: {
        width: 80,
        height: 20,
        borderRadius: 5,
        backgroundColor: "#00B569"
    },
    grayTag: {
        width: 80,
        height: 20,
        borderRadius: 5,
        backgroundColor: "rbga(0,0,,0.3)"
    },
    searchResultImage: {
        width: windowWidth - 20,
        height: windowWidth - 20
    },
    searchResultCard: {
        width: windowWidth - 20,
        height: windowWidth + 120
    },
    searchResultDetailCard: {
        height: 100,
        alignSelf: 'stretch',
        backgroundColor: "#fff"
    },
    timeTextInput: {
        alignSelf: 'center',
        padding: 7,
        borderBottomWidth: 0.3,
        borderTopWidth: 0.3,
        borderLeftWidth: 0.3,
        borderRightWidth: 0.3,
        marginVertical: 12,
        borderRadius: 5,
        width: windowWidth * .75,
        height: 60
    },
    lightTextInput: {
        borderBottomColor: "#ffffff",
        borderBottomColor: "#ffffff",
        borderTopColor: "#ffffff",
        borderLeftColor: "#ffffff",
        borderRightColor: "#ffffff"
    },
    darkTextInput: {
        borderBottomColor: "#000000",
        borderTopColor: "#000000",
        borderLeftColor: "#000000",
        borderRightColor: "#000000"
    },
    inlineTextButton: {
        color: "#fff",
        textDecorationLine: "underline"
    },
    pressedInlineTextButton: {
        color: "#fff",
        fontWeight: "bold",
        opacity: 0.6
    }
});
