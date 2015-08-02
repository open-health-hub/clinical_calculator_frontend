function endpointCallback(fields, response) {

}

function defineEndpoint(name, label, fields, form, addressOverride) {
  var endpoint = new FormEndpoint(name, label, Object.keys(fields)),
      formElement = document.getElementById(form);

  if (formElement === null || formElement === undefined) {
    throw new Error("missing form `" + form + "'");
  }

  formElement.onsubmit = function(e) {
    e.preventDefault();

    var address = window.location.href;

    if (addressOverride !== null && addressOverride !== undefined) {
      address = addressOverride;
    }

    endpoint.request(address, endpointCallback.bind(null, fields));
  };
}
