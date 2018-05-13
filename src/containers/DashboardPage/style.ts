import { withStyles } from 'material-ui';

export interface IStyle {
    root: any;
    content: any;
}

export default withStyles(({ palette, spacing, breakpoints, mixins, transitions }): IStyle => ({
    root: {
        display: 'flex',
        flexFlow: 'column',
        flex: '1 1 auto'
    },
    content: {
        overflowY: 'auto',
        flex: '1 1 auto'
    }
}));