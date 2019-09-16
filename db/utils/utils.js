exports.formatDates = list => {
  return [...list].map(element => {
    const formattedElement = { ...element };
    const date = new Date(formattedElement.created_at);
    formattedElement.created_at = date;
    return formattedElement;
  });
};
exports.makeRefObj = (arr, key, value) => {
    return arr.reduce((refObj, obj) => {
        refObj[obj[key]] = obj[value];
        return refObj
    }, {});
}

exports.formatComments = (comments, articleRef) => {
    return comments.map((element) => {
        element["article_id"] = articleRef[element["belongs_to"]];
        delete element["belongs_to"];
        element["author"] = element["created_by"]
        delete element["created_by"]
        return element;
    })
};
