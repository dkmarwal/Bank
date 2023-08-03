import React from "react";
import "./styles.scss";
import { Card, Box } from "@material-ui/core";

class PercentageBar extends React.Component {

  render() {
    const { stacked, stats, totalTitle, partialTitle, primaryBarColor, secondaryBarColor, total, partial, taskCompleted, taskRunning } = this.props;
    const topDivPercent = total!=0?(partial/total * 100).toPrecision(2):0;
    const calculatedWidth = topDivPercent>75 ? 30 : (topDivPercent>50 ? 20 : (topDivPercent>25 ? 10 : (topDivPercent>0 ? 3: 0)))
    return (
      <Card
        className="cardWrap"
        elevation={0}
      >
        <Box className="_content">
          <Box className="main">
            <Box className="bar bar--modify">
              <Box className="primary primary__top" 
              title={`${topDivPercent} %`}
              style={{position:`${stacked && 'static'}`,cursor:"pointer",backgroundColor:`${primaryBarColor}`, height:`${stacked ? '30px':'32px'}`,
              // minWidth:`${stacked?topDivPercent:partial!=0?'30':'22'}%`
              marginTop:`${stacked ? '4px':'0px'}`,width:`${calculatedWidth}%`
              }}>
                {calculatedWidth > 10 ? <span>{topDivPercent} %</span> : <></>}
              </Box>
              <Box className="bar-title" title={partialTitle}>{partialTitle}</Box>
            </Box>
            <Box className="bar">
              <Box className="primary primary__bottom" style={{backgroundColor:`${secondaryBarColor}`, height:`${stacked ? '27px':'33px'}`}}>
                <span className="primary primary__bottom__color">{stacked && '100%'}</span>
              </Box>
              <Box className="bar-title" title={totalTitle}>{totalTitle}</Box>
            </Box>
          </Box>
          {stats && (taskCompleted > 0 || taskRunning > 0) &&
          <Box className="stats">
            {taskCompleted} Completed | {taskRunning} Running Campaign
          </Box>
          }
        </Box>
      </Card>
    );
  }
}

export default PercentageBar;
