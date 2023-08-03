import React from 'react';
import Styles from './style';
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Checkbox, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Notification from "~/components/Notification";
import { connect } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
    ListItem,
    ListItemText,
    ListItemIcon,
} from "@material-ui/core";
class ColumnSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colOrder: this.props.columns,
    };
  }

  componentDidMount = () => {};
    
  onDragEnd = (result) => {
    const {colOrder} = this.state;
    if (!result.destination) {
      return;
    }
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
    };
    const items = reorder(
        colOrder,
      result.source.index,
      result.destination.index
    );
    this.setState({
      colOrder: items,
    });
  };
  applyPayeeFilter = () =>{
      const {colOrder} = this.state;
      const {setCol,onCancelClick}= this.props;
      setCol(colOrder);
      onCancelClick()
  }
  getDefaultColoumnData=()=>{
    const {tab}= this.props;
    this.setState({
      colOrder: this?.props?.payees?.columnList.map((item) => (
          { ...item, isChecked: tab ==="pending" ? item.isCheckPending : (tab === "enrolled" ? item.isCheckEnrolled : item.isCheckDeclined),  key : item.infokey})),
  });
  }
  handlePayeeCheck = (e, payee) => {
    const { colOrder } = this.state;
    this.setState({
      colOrder: colOrder.map((item, i) =>
            item.infokey === payee.infokey
                ? {
                    ...item,
                    isChecked: e.target.checked,
                }
                : item
        ),
    })
}
  render() {
    const {
      classes,
      onCancelClick,
    } = this.props;
    const { colOrder, variant, errMsg } = this.state;

    return (
      <>
        <Grid container>
          <Grid item xs={12}>
            <DragDropContext              
              onDragEnd={this.onDragEnd}
            >
              {colOrder.map((col, index) => (
                <Droppable key={index} droppableId={`${index}`}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable
                        key={col.key}
                        draggableId={col.infokey}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <ListItem
                              ContainerComponent="li"
                              style={{ paddingTop: "0" }}
                            >
                              <ListItemIcon className={classes.minWidth}>
                                <img
                                  src={require(`~/assets/icons/drag_icon.svg`)}
                                  alt={"drag-icon"}
                                  style={{ verticalAlign: "text-bottom" }}
                                />
                              </ListItemIcon>
                              <ListItemText>
                                <Checkbox
                                  name="columns"
                                  checked={col.isChecked}
                                  onChange={(e) => this.handlePayeeCheck(e, col)}
                                  icon={
                                    <img
                                      src={require(`~/assets/icons/checkbox_unselected.svg`)}
                                      alt={"unchecked-icon"}
                                      style={{ verticalAlign: "text-bottom" }}
                                    />
                                  }
                                  checkedIcon={
                                    <img
                                      src={require(`~/assets/icons/checkbox_selected.svg`)}
                                      alt={"checked-icon"}
                                      style={{ verticalAlign: "text-bottom" }}
                                    />
                                  }
                                />
                                {col.label}
                              </ListItemText>
                            </ListItem>
                          </div>
                        )}
                      </Draggable>
                    </div>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
          </Grid>
          <Grid container item xs={12} justify="flex-start">
            <Box p={2}>
              <Typography
                variant="body1"
                onClick={()=>this.getDefaultColoumnData()}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={require(`~/assets/icons/replay.svg`)}
                  alt={"default-icon"}
                  style={{ verticalAlign: "bottom", marginRight: "5px" }}
                />{" "}
                Default Setting
              </Typography>
            </Box>
          </Grid>
          <Grid container item xs={12} justify="center">
            <Grid item xs={5}>
              <Box m={2}>
                <Button
                  type="submit"
                  fullWidth={true}
                  variant="outlined"
                  color="primary"
                  onClick={onCancelClick}
                  className={classes.btnFont}
                >
                  CANCEL
                </Button>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box m={2}>
                <Button
                  disableElevation
                  type="submit"
                  fullWidth={true}
                  variant="contained"
                  color="primary"
                  onClick={this.applyPayeeFilter}
                  className={classes.btnFont}
                >
                  APPLY
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {variant && (
          <Notification
            variant={variant}
            message={errMsg}
            handleClose={() => this.notificationClose()}
          />
        )}
      </>
    );
  }
}

export default connect(state => (
    {...state.payees }
))(withStyles(Styles)(ColumnSettings));
