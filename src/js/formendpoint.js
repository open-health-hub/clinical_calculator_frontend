function FormEndpoint(name, label, fields) {
  Endpoint.call(this, name, label);

  if (fields === null || fields === undefined) {
    fields = [];
  }

  Object.defineProperties(this, {
    fields: {
      value: fields
    }
  });
}

FormEndpoint.prototype.request = function request(baseAddress, port, callback) {
  var fieldValues = {};

  this.fields.forEach(function(field) {
    var element = document.getElementById("field_" + field);

    if (element === null || element === undefined) {
      throw new Error("missing field `" + field + "'");
    }

    fieldValues[field] = element.value;
  });

  Endpoint.prototype.request.call(this, baseAddress, port, fieldValues, callback);
};
