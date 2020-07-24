import React, {Component} from 'react';
import Providers from "../Providers/Providers";
import axios from "axios";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import './ProviderPanel.css';
import {Link} from "react-router-dom";

class ProviderPanel extends Component {

    constructor(props){
        super(props);
        this.state = {
            providers: [],
            searchQuery: ""
        }
    }

    componentDidMount(){
        this.loadData();
    }

    searchChanged = (e) => {
        this.setState({
            searchQuery: e.target.value
        }, ()=>{
           this.loadData();
        })

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

        let URL = "https://careamabrain.cmcoffee91.dev/providers";
        // let URL = "http://localhost:3000/providers";

        this.setState({
            providers: []
        });


        const response = await axios({
            method: 'get',
            url: URL,
            params:{
               searchQuery: this.state.searchQuery
            }

        });


        const data = await response.data;
        console.log("data " + JSON.stringify(data));

        this.setState({
            providers: data
        });

    }

    render() {
        console.log("token is " + this.props.token);
        console.log("user is " + JSON.stringify(this.props.user));
        let providerButton = <Button variant="contained" color="primary" to="/providerSignup" component={Link}>
            Add New Provider
        </Button> ;
        if(this.props.user && this.props.user.admin){
            providerButton = <div id="noneElement"></div>;
        }
        return (
            <div id="providerContainer">
                <div id="actionContainer">
                    {providerButton}

                    <TextField id="search" label="Search" onChange={this.searchChanged}  variant="outlined"/>

                </div>

                {this.state.providers.map((data, index) => (
                    <Providers key={index} index={index} data={data}/>
                ))}
            </div>
        );
    }
}

export default ProviderPanel;