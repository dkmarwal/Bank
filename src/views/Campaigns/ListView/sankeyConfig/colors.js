export const getNodeColor = (point) => {
  const color = point.color;
  const id = point.id;
  switch (id) {
    case "Approved":
      return "#264D88";
    case "Pending Profile Creation":
      return "#FAE951";
    case "Pending Profile Confirmation":
      return "#FAE951";
    case "Pending Profile Completion":
      return "#FAE951";
    case "Pending Approval":
      return "#68BBF1";
    case "Pending Validation":
      return "#68BBF1";
    case "Unable To Validate":
      return "#FFA083";
    case "Disapproved":
      return "#FFA083";
    case "Revoked":
      return "#FFA083";
    case "ACH":
      return "#269BE7";
    case "Cross Border":
      return "#497E99";
    case "Wire":
      return "#78A4BD";
    case "Check":
      return "#D2E7FE";
    case "VCA":
      return "#3DB8B1";
    default:
      return color;
  }
};

export const getStatusColorToPoint = (point) => {
  const toName = point && point["toNode"] && point["toNode"]["id"];
  switch (toName) {
   case "Approved":
    return "#264D88";
   case "Pending Profile Creation":
    return "#FAE951";
   case "Pending Profile Confirmation":
    return "#FAE951";
   case "Pending Profile Completion":
    return "#FAE951";
   case "Pending Approval":
    return "#68BBF1";
   case "Pending Validation":
    return "#68BBF1";
   case "Unable To Validate":
    return "#FFA083";
   case "Disapproved":
    return "#FFA083";
   case "Revoked":
    return "#FFA083";
 
   case "ACH":
    return "#269BE7";
   case "Cross Border":
    return "#497E99";
   case "Wire":
    return "#78A4BD";
   case "Check":
    return "#D2E7FE";
   case "VCA":
    return "#3DB8B1";
   default:
    return point.toNode.color;
  }
 };
 
 export const getStatusColorFromPoint = (point) => {
  const fromName = point && point["fromNode"] && point["fromNode"]["id"];
  switch (fromName) {
   case "Approved":
    return "#264D88";
   case "Pending Profile Creation":
    return "#FAE951";
   case "Pending Profile Confirmation":
    return "#FAE951";
   case "Pending Profile Completion":
    return "#FAE951";
   case "Pending Approval":
    return "#68BBF1";
   case "Pending Validation":
    return "#68BBF1";
   case "Unable To Validate":
    return "#FFA083";
   case "Disapproved":
    return "#FFA083";
   case "Revoked":
    return "#FFA083";
   default:
    return point.toNode.color;
  }
 };