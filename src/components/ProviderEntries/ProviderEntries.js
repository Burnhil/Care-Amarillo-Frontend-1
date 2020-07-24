import React, {Component} from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@material-ui/core';
import  format  from "date-fns/format";
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import 'date-fns';
import axios from "axios";
import MaterialTable from "material-table";
import { forwardRef } from 'react';


import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import AlertDialogSlide from "../AlertDialogSlide";
import { ToastContainer, ToastMessage, ToastMessageAnimated } from "react-toastr";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};





const CLIENT_ID = '461686716459-krre353uecr54mdkbbj094vf9mevti55.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCOvmLGpbzVEgMywSh3g4g6mbaynTbdIiU';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";


const ProviderTable = (props) => {
    return  <div style={{ maxWidth: "100%" }}>
        <MaterialTable
            icons={tableIcons}
            columns={[
                { title: "Amount Changed", field: "amountChanged" },
                { title: "Date", field: "createdAt", type: "datetime", searchable:false },
            ]}
            data={props.data}
            title="Provider Entry"
            options={{
                sorting: true,
                search: true,
                exportButton: true,
                exportCsv: (columns, data) => {

                    props.setOpen();
                }
            }}
        />
    </div>;
}

class ProviderEntries extends Component {
    constructor(props){
        super(props);
        let midNight = new Date();
        midNight.setHours(24,0,0,0);

        let todayMidNight = new Date();
        todayMidNight.setHours(0,0,0,0);

        this.state = {
            entries: [],
            selectedStartDate: todayMidNight,
            selectedEndDate: midNight,
            open: false,
            sheetsDialogOpen: false,
            alertTitle : "CSV Export Options",
            alertDescription : "How would you like your CSV to be exported?",
            alertYesOptionTitle : "CSV",
            alertNoOptionTitle : "Google Sheets",
            alertSheetsTitle : "Google Sheets Export Options",
            alertSheetsDescription : "Copy the new link to your clipboard or open the Google Sheet in a new tab?",
            alertSheetsYesOptionTitle : "Copy",
            alertSheetsNoOptionTitle : "Open In New Tab",
            sheetUrl : ""
        }
    }




    componentDidMount() {
        this.loadData();
    }



    loadData = async () => {

        // const response = await fetch(URL, {
        //     // mode: 'no-cors',
        //     method: 'GET',
        //     headers: {
        //         Accept: 'application/json',
        //     },
        // },);

        // const data = await response.json();
        // console.log("data " + JSON.stringify(data));
        let providerId = "5ef9bfe4cd24582b13b7055d";
        console.log("sstart date:" + this.state.selectedStartDate.toISOString());
        console.log("end date:" + this.state.selectedEndDate.toISOString());

        let URL = "https://careamabrain.cmcoffee91.dev/providerEntriesByDate/" + providerId + "?startDate=" +  this.state.selectedStartDate.toISOString()   + "&endDate=" + this.state.selectedEndDate.toISOString();

        this.setState({
            entries: []
        });

        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwdXNoSWQiOiIiLCJhZG1pbiI6ZmFsc2UsInN1cGVyQWRtaW4iOnRydWUsInVzZXJUeXBlIjozLCJhY3RpdmUiOnRydWUsIl9pZCI6IjVlZjliODcwY2QyNDU4MmIxM2I3MDU1YyIsImNyZWF0ZWRBdCI6IjIwMjAtMDYtMjlUMDk6NDY6MjQuNzkzWiIsInVwZGF0ZWRBdCI6IjIwMjAtMDYtMjlUMDk6NDY6MjQuNzkzWiIsImZOYW1lIjoiVG9tbXkiLCJsTmFtZSI6IkpvaG5zb24iLCJlbWFpbCI6InRlc3RlckBhbWFyaWxsb2NvbGxlZ2UuY29tIiwicGhvbmUiOiI4MDYyMzQ1MzgzIiwidGl0bGUiOiJTdXBlciBBZG1pbiIsIl9fdiI6MCwiaWF0IjoxNTk0NTQ2OTQ1fQ.ilbHub9Bmof0cFJxirK4ZeJMar9rBncdDn4-d9tRbCc";

        const config = {
             "Authorization": `Bearer ${token}`
        };

        const response = await axios({
            method: 'get',
            url: URL,
            headers: config
        });




        const data = await response.data;
        console.log("data " + JSON.stringify(data));

        this.setState({
            entries: data
        });

    }

    handleStartDateChange = (e) => {
        // setSelectedStartDate(e);
        this.setState({
            selectedStartDate: e,

        },
        () => {
            this.loadData();
        });
    };

    handleEndDateChange = (e) => {
        // setSelectedEndDate(e);
        this.setState({
            selectedEndDate: e
        },
            () => {
                this.loadData();
        });
        this.loadData();
    };


    exportReportToGoogleSheets = () =>{
        this.handleClientLoad();

    }



    handleClientLoad = () => {
        window.gapi.load('client:auth2', this.initClient);
    }



    updateSignInStatus = (isSignedIn) => {
        console.log("updateSignInStatus = " + isSignedIn);
        if (isSignedIn) {
            this.makeGoogleSheetsApiCall();
            // saveDataToSheet();
        }
    }

    initClient = async() => {
        await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: DISCOVERY_DOCS,
        });

        await window.gapi.auth2.init({
            client_id: CLIENT_ID,
            scope: SCOPES
        });

        window.gapi.auth2.getAuthInstance().signIn();

        window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);

        // Handle the initial sign-in state.
        this.updateSignInStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
    }


    makeGoogleSheetsApiCall = async() => {

        let response = await window.gapi.client.sheets.spreadsheets.create({
            properties: {
                title: "Provider Entries"
            }
        });

        let result = response.result;
        let sheets = response.result.sheets;
        let sheetOne = sheets[0];
        let sheetId = result.spreadsheetId;
        let sheetUrl = result.spreadsheetUrl;
        console.log("sheets " + sheets);
        console.log("sheetOne " + sheetOne);
        console.log("sheetOne id " + sheetId);
        console.log("sheetOne url " + sheetUrl);

        this.setState({
            sheetUrl: sheetUrl
        },()=>{
            this.setSheetsDialogOpen();
        });

        this.saveDataToGoogleSheet(sheetId);


    }

    saveDataToGoogleSheet = (sheetId) => {

        var len = this.state.entries.length;
        var arr = new Array(len);
        // tovc.tovresults = results;
        arr[0] = new Array(3);
        arr[0][0] = "Change Amount";
        arr[0][1] = "Date";

        for (var i = 1; i < len + 1; i++) {
            arr[i] = new Array(3);
            for (var j = 0; j < 2; j++) {


                if (j == 0) {
                    arr[i][j] = this.state.entries[i - 1]["amountChanged"];
                } else if (j == 1) {
                    let formattedDate = format(new Date(this.state.entries[i-1]["createdAt"]), "MMMM d, yyyy H:mma").toString();
                    arr[i][j] = formattedDate;
                }

            }
        }


        var data = [];
        data.push({
            range: 'Sheet1',
            values: arr
        });
        // Additional ranges to update.

        var body = {
            data: data,
            valueInputOption: 'RAW'
        };

        var spreadsheetId = sheetId;

        console.log("arr " + JSON.stringify(arr));

        window.gapi.client.sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: spreadsheetId,
            resource: body
        }).then((response) => {
            var result = response.result;
            console.log(`${result.totalUpdatedCells} cells updated.`);
        });
    }

    //todo: add date to filename
    exportReport = () =>{
        let arr = [];
        let len = this.state.entries.length;
        for (let i = 0; i < len; i++) {
            let formattedDate = format(new Date(this.state.entries[i].createdAt), "MMMM d, yyyy H:mma").toString();
            arr.push({
                "Amount Changed": this.state.entries[i].amountChanged,
                "Date":formattedDate
            });
        }

        this.downloadCSV({
            filename: "provider-entry-report-data.csv"
        }, arr);
    }


    //todo: put in separate files so multiple components can call it
    downloadCSV = (args, report) => {
        let data, filename, link;
        let csv = this.convertArrayOfObjectsToCSV({
            data: report
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    //todo: put in separate files so multiple components can call it
    convertArrayOfObjectsToCSV = (args) => {
        let result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    setOpen = () =>{
        let openStatus = this.state.open;
        if(openStatus){
            openStatus = false;
        }
        else{
            openStatus = true;
        }

        this.setState({
            open: openStatus
        });
    }

    setSheetsDialogOpen = () =>{
        let openStatus = this.state.sheetsDialogOpen;
        if(openStatus){
            openStatus = false;
        }
        else{
            openStatus = true;
        }

        this.setState({
            sheetsDialogOpen: openStatus
        });
    }

    slideAlertCallback = (isCSV) => {
        if (isCSV) {
            console.log("is csv" );
            this.exportReport();
        } else {
            console.log("is sheets");
            this.exportReportToGoogleSheets();
        }
    }


    sheetsSlideAlertCallback = (isCopy) => {
        if (isCopy) {
            console.log("is copy" );
            navigator.clipboard.writeText(this.state.sheetUrl);

            this.container.success(`Link Copied To Clipboard`, `Success`, {
                closeButton: true,
            });
        } else {
            console.log("is open in new tab");
            window.open(this.state.sheetUrl, '_blank');
        }
    }




    render() {
        return (
            <Container maxWidth="lg" className="car-container">
                <ToastContainer
                    ref={ref => this.container = ref}
                    className="toast-top-right"
                />
                <div className="flex-container">
                    {/*dialog used to open csv option*/}
                    <AlertDialogSlide open={this.state.open} setOpen={this.setOpen} alertSlideCallback={this.slideAlertCallback} title={this.state.alertTitle}
                                      description={this.state.alertDescription} yesOptionTitle={this.state.alertYesOptionTitle} noOptionTitle={this.state.alertNoOptionTitle} />


                    {/*dialog for copy or open in new tab of google sheets link */}
                    <AlertDialogSlide open={this.state.sheetsDialogOpen} setOpen={this.setSheetsDialogOpen} alertSlideCallback={this.sheetsSlideAlertCallback} title={this.state.alertSheetsTitle}
                                      description={this.state.alertSheetsDescriptionDescription} yesOptionTitle={this.state.alertSheetsYesOptionTitle} noOptionTitle={this.state.alertSheetsNoOptionTitle} />

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <div id="dateContainer">
                            <KeyboardDatePicker
                                disableToolbar
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-start"
                                label="Start Date"
                                value={this.state.selectedStartDate}
                                onChange={this.handleStartDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <KeyboardDatePicker
                                disableToolbar
                                format="MM/dd/yyyy"
                                margin="normal"
                                id="date-picker-end"
                                label="End Date"
                                value={this.state.selectedEndDate}
                                onChange={this.handleEndDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </div>
                    </MuiPickersUtilsProvider>
                </div>
                <ProviderTable data={this.state.entries} setOpen={this.setOpen}/>
            </Container>
        );
    }
}

export default ProviderEntries;