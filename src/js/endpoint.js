function Endpoint(name, label) {
  Object.defineProperties(this, {
    name: {
      value: name
    },
    label: {
      value: label
    }
  });
}

Endpoint.prototype.request = function request(baseAddress, port, fields, callback) {
  var address = new URI(baseAddress).port(port).query("").path(this.name).toString();

  address += "?jsonp_callback=?";

  $.getJSON(address, fields, callback);
};
