import * as React from 'react';
import { DialogTitle, DialogContent, TextField, DialogActions, Button } from 'material-ui';

interface IProps {
    networkName: string;
    serverName: string;
    onClick: (networkName: string, serverName: string) => void;
}

interface IState {
    networkName: string;
    serverName: string;
}

export default class NetworkDialog extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { networkName: props.networkName, serverName: props.serverName };
    }

    public render() {
        return (
            <div>
                <DialogTitle>Select Network</DialogTitle>
                <DialogContent>
                    <TextField label="Network Name"
                        margin="dense"
                        value={this.state.networkName}
                        onChange={e => this.setState({ networkName: e.target.value })} />
                    <TextField label="Server Name"
                        margin="dense"
                        value={this.state.serverName}
                        onChange={e => this.setState({ serverName: e.target.value })} />
                    <DialogActions>
                        <Button onClick={e => {
                            this.props.onClick(this.state.networkName, this.state.serverName);
                        }}>Submit</Button>
                    </DialogActions>
                </DialogContent>
            </div>
        );
    }
}
