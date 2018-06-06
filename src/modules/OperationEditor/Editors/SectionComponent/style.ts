import withStyles from '@material-ui/core/styles/withStyles';

export interface IStyle {
    container: any;
    suggestionsContainerOpen: any;
    suggestion: any;
    suggestionsList: any;
    textField: any;
    buttonContainer: any;
    selectionButton: any;
    selectionButtonSelected: any;
}

export default withStyles(({ palette, spacing, breakpoints }): IStyle => ({
    buttonContainer: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    selectionButton: {
        flexGrow: 1,
        minWidth: '22%',
        boxShadow: 'none',
        textTransform: 'unset',
        margin: spacing.unit / 2
    },
    selectionButtonSelected: {
        border: '1px solid transparent',
        flexGrow: 1,
        minWidth: '22%',
        boxShadow: 'none',
        textTransform: 'unset',
        margin: spacing.unit / 2
    },
    container: {
        flexGrow: 1,
        position: 'relative'
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        marginTop: spacing.unit,
        marginBottom: spacing.unit * 3,
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none'
    },
    textField: {
        width: '100%',
    },
}));