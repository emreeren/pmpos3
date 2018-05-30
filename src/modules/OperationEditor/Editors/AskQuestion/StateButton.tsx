import * as React from "react";
import { Button } from "@material-ui/core";
import decorate, { IStyle } from './style';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import { IValueSelection } from "./IValueSelection";

export interface IStateButtonProps {
    value: IValueSelection;
    isSelected: (value: IValueSelection) => boolean;
    onClick: (value: IValueSelection) => void;
}

class StateButton extends React.Component<IStateButtonProps & WithStyles<keyof IStyle>> {
    public render() {
        return (
            <Button
                size="small"
                color={this.props.isSelected(this.props.value) ? 'secondary' : 'default'}
                variant="raised"
                className={this.props.classes.selectionButton}
                onClick={() => {
                    this.props.onClick(this.props.value);
                }}
            >
                {this.props.value.quantity > 1 ? `${this.props.value.quantity} x ` : ''}{this.props.value.display}
            </Button>
        );
    }
}

export default decorate(StateButton)