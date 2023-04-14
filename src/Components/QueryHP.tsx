import {
    Button,
    TextField,
    Grid,
    CircularProgress,
    Typography
}
    from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as React from 'react';
import axios from 'axios';
import './QueryHP.css';

interface IQueryHPState {
    query: string,
    answer: string,
    loading: boolean,
    options: string[]
}
const title = "Harry Potter Trivia Bot";
// const base_uri = "http://127.0.0.1:5000"
const base_uri = "https://harrypotterf1.azurewebsites.net"

export default class QueryHP extends React.Component<any, IQueryHPState> {
    private timeout: any;

    constructor(props: any) {
        super(props);

        this.state = {
            query: "",
            answer: "",
            loading: false,
            options: []
        }
    }

    private get_responses = (query: string) => {
        console.log("getting query");
        console.log(query);
        this.setState({
            loading: true,
            answer: ""
        });

        axios.get<string>(base_uri + "/answer", {
            params: {
                query: query
            },
        })
            .then((response) => {
                console.log(response);
                this.setState({
                    answer: response.data,
                    loading: false
                })
            })
            .catch((error) => {
                console.log(error);
                this.clearState();
            });
    }

    private clearState = () => {
        this.setState({
            answer: "",
            loading: false
        });
    }

    private handleSubmit = () => {
        this.get_responses(this.state.query)
    }

    private onChangeQuery = (newValue: string, lookupSuggestions: boolean) => {
        this.setState({ query: newValue });
        console.log("Updating query to " + newValue)
        if (lookupSuggestions) {
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                const query = this.state.query;
                console.log("Searching for: " + query);
                // this.setState({ options: [this.state.query + "the rest of suggestion"] })
                axios.get<string>(base_uri + "/autocomplete", {
                    params: {
                        query: query
                    },
                })
                    .then((response) => {
                        console.log(response);
                        const data = response.data;
                        const suggestion = query + data;
                        console.log("Setting options to " + suggestion);
                        this.setState({
                            options: [suggestion],
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        this.clearState();
                    });
            }, 800);
        }
    };


    public render() {
        return (
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={8}
            >
                {/* align items to the right */}
                <Grid item container justify="flex-end" className="info_button">
                    <Button target="_blank" href="https://introductory.medium.com/a-harry-potter-trivia-bot-powered-by-gpt-3-b9607d93efd1">About</Button>
                </Grid >
                <Grid item id="grid_title">
                    <Typography variant="h3" >
                        {title}
                    </Typography>
                </Grid>
                <Grid item container>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={3}>
                        <Grid item xs={8} md={8} >
                            <Autocomplete
                                id="combo-box-demo"
                                freeSolo
                                fullWidth
                                disableClearable
                                options={this.state.options}
                                value={this.state.query}
                                onInputChange={(event: any, newValue: string) => {
                                    console.log("value from input chnage")
                                    this.onChangeQuery(newValue, false);
                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        className="GetToken-text"
                                        id="filled-multiline-flexible"
                                        label="Your Question"
                                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            this.onChangeQuery(event.target.value, false /* temporarily disable suggestions */);
                                        }}
                                        fullWidth
                                        variant="filled"
                                        onKeyPress={(ev) => {
                                            if (ev.key === 'Enter') {
                                                this.handleSubmit();
                                                ev.preventDefault();
                                            }
                                        }}
                                    />
                                } />
                        </Grid>
                        <Grid item className="create__createbuttonwrapper" xs={2} md={2}>
                            <Button
                                className={"create__button"}
                                disabled={this.state.loading}
                                variant="contained"
                                color="primary"
                                onClick={this.handleSubmit}>
                                Search
                            </Button>
                            {this.state.loading &&
                                <CircularProgress size={36} className="create__createbuttonspinner" />
                            }
                        </Grid>
                    </Grid>
                </Grid>
                {
                    !!this.state.answer &&
                    <Grid item>
                        <Typography variant="h6">Answer</Typography>
                        <Typography variant="h4">
                            {this.state.answer}
                        </Typography>
                    </Grid>
                }
            </Grid >
        );
    }
}