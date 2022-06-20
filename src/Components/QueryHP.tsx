import {
    Button,
    TextField,
    Grid,
    CircularProgress,
    Typography
    }
    from '@material-ui/core';
import * as React from 'react';
import axios from 'axios';
import './QueryHP.css';

interface APIResponse {
    responses: IResponse[]
}

interface IResponse {
    answer: string,
    passage: string,
    start: number,
    end: number,
    score: number
}

interface IQueryHPState {
    query: string,
    lastResponse: IResponse | null,
    loading: boolean
}
const title = "Ask a Trivia Question about Harry Potter and the Sorcerer's Stone.";
const base_uri = "http://harrypotterb2.azurewebsites.net"

export default class QueryHP extends React.Component<any, IQueryHPState> {

    constructor(props: any) {
        super(props);

        this.state = {
            query: "",
            lastResponse: null,
            loading: false
        }
    }

    private get_responses = (query: string) => {
        console.log("getting query");
        console.log(query);
        this.setState({
            loading: true
        });
        
        axios.get<APIResponse>(base_uri + "/search", {
            params: {
              q: query
            },
        })
        .then((response) => {
            console.log(response);
            const data = response.data
            this.setState({
                lastResponse: data.responses[0],
                loading: false
            })
        })
        .catch( (error) => {
            console.log(error);
            this.clearState();
        });
    }

    private clearState = () => {
        this.setState({
            lastResponse: null,
            loading: false
        });
    }

    private handleSubmit= () => {
        this.get_responses(this.state.query)
    }

    private onChangeQuery = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({query: event.target.value});
    };


    public render() {
        return (
            <Grid
                container
                direction="column"
                alignItems="center"
                >
                    <Typography variant="h3">
                        {title}
                    </Typography>
                    <TextField
                        className="GetToken-text"
                        id="filled-multiline-flexible"
                        label="Your Question"
                        multiline
                        fullWidth
                        value={ this.state.query }
                        onChange={ this.onChangeQuery }
                        rows={2}
                        variant="filled"
                    />
                    <Grid item className="create__createbuttonwrapper">
                        <Button
                            className={ "create__button" }
                            disabled={ this.state.loading}
                            variant="contained"
                            color="primary"
                            onClick={ this.handleSubmit }>
                            Search
                        </Button>
                        { this.state.loading &&
                            <CircularProgress size={36} className="create__createbuttonspinner" />
                        }
                    </Grid>
                    {
                        !!this.state.lastResponse &&
                            <Grid item>
                                <Typography variant="h3">
                                    {this.state.lastResponse.answer}
                                </Typography>
                                <Typography variant="body1">
                                    {this.state.lastResponse.passage.substring(0, this.state.lastResponse.start) }
                                    <span className='bold'>{ this.state.lastResponse.passage.substring(this.state.lastResponse.start, this.state.lastResponse.end) }</span>
                                    { this.state.lastResponse.passage.substring(this.state.lastResponse.end) }
                                </Typography>
                            </Grid>
                    }
            </Grid>
        );
    }
}