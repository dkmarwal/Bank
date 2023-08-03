const removeArrElement = (ele, arr) => {
    const index = array.indexOf(ele);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
export removeArrElement;