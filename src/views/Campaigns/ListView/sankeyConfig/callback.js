import * as d3 from "d3";

const Callback = (chart, data) => {
  const points = chart.series[0].nodes;

  const trimTextByLength = (text, length) => {
    return `${String(Boolean(text) && text).substring(0, length)}...`;
  };

  const firstColumnRendering = (point, i) => {
    const element = point && point.graphic && point.graphic.element;
    const info = data && data["description"] && data["description"].filter((obj) => obj["campaign"] == point.id)[0];

    const nodeHeigth = element && element.getAttribute("height");
    
    const parent = d3.selectAll(".highcharts-tracker");
    parent.append("rect")
      .attr("x", element && element.getAttribute("x") + 15)
      .attr("y", element && element.getAttribute("y"))
      .attr("width", 20)
      .attr("fill", element && element.getAttribute("fill"))
      .attr("height", element && element.getAttribute("height"));

    if (info["campaign"] == point.id) {      
        const textLength = info && info["campaign"] && info["campaign"].length;
        const actualText = textLength > 14 ? trimTextByLength(point.id, 12) : point.id;
        chart.renderer
          .text(`${point && point.sum} ${actualText}`, 10, Number(nodeHeigth) / 2 + Number(element && element.getAttribute("y")) + 14.5)
          .attr({ rotation: 0, })
          .attr("class", "customText")
          .css({
            color: "#000000",
            fontSize: "16px",
            fontWeight: "500px",
            fontFamily: "'Interstate', Arial, Helvetica, sans-serif"
          })
          .add();

        chart.renderer
          .text(info && info["description"], 10, Number(nodeHeigth) / 2 + Number(element && element.getAttribute("y")) + 30)
          .attr({
            rotation: 0,
          })
          .attr("class", "customText")
          .css({
            color: info && info["status"] == "Completed" ? "#4F9A00" : "#007AFF",
            fontSize: "12px",
            class: "customText"
          })
          .add();      
    }
  };  

  points &&
    points.forEach((point, i) => {
      if (point.column == 0 && point.isNode) {
        firstColumnRendering(point, i);
      }      
    });
}

export default Callback;