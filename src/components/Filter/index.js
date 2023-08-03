import React from "react";
import { Box, makeStyles, Chip } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "./styles.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    width: "100%",

    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
  wrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },

  item: {
    color: "#0b1941",
    background: "#e4e4e4",
    maxWidth: 200,
    margin: "5px",
    position: "relative",
    fontSize: "14px",
    "&:hover": {
      color: "#fff",
    },
  },

  activeItem: {
    background: "#0b1941",
    color: "#fff",
    fontSize: "14px",
    maxWidth: 200,
    margin: "5px",
  },
  slider: {
    width: "100%",
    display: "block",
  },

  btn: {
    border: "none",
    margin: "4px",
    backgroundColor: "#ffffff",
  },
}));

export default function ChipFilter(props) {
  const classes = useStyles();

  const { handleClickFilter, list, selectedFilterItem } = props;

  const listItems =
    list.length &&
    list.map((item, index) => {
      return (
        <Slide index={index} style={{ width: "auto" }}>
          <Chip
            key={index}
            label={`${item.roleName} (${item.count})`}
            size="medium"
            className={classes.item}
            className={
              selectedFilterItem.roleName == item.roleName
                ? classes.activeItem
                : classes.item
            }
            color="primary"
            onClick={(event) => handleClickFilter(event, item, index)}
          />
        </Slide>
      );
    });

  const listCount = list && list.length > 62 ? (list.length - 61) :list.length > 60 ? (list.length - 58) : list.length > 53 ? (list.length - 52) : list.length > 43 ? (list.length - 42) : list.length > 40 ? (list.length - 39) : (list.length > 20) ? list.length - 19 : (list.length > 15) ? list.length - 13 : (list.length > 10) ? list.length - 9 : (list.length > 9) ? list.length - 6 :(list.length > 6) ? list.length - 3 : (list.length > 5) ? list.length - 3 : (list.length - 0);

  return (
    <Box className={classes.root}>
      {list.length > 0 && (
        <CarouselProvider
          naturalSlideHeight={35}
          naturalSlideWidth={250}
          visibleSlides={listCount}
          totalSlides={list.length}
          isIntrinsicHeight={true}
          isIntrinsicWidth={true}
          className={classes.wrapper}
        >
          <ButtonBack className={classes.btn}>
            <ChevronLeftIcon />
          </ButtonBack>
          <Slider className={classes.slider}>{listItems}</Slider>
          <ButtonNext size="medium" className={classes.btn}>
            <ChevronRightIcon />
          </ButtonNext>
        </CarouselProvider>
      )}
    </Box>
  );
}
