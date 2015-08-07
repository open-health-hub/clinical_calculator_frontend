function showAlert(clazz, text, baseElement) {
  var div = document.createElement('div');

  div.className = "alert " + clazz + " alert-dismissible";

  var button = document.createElement('span');

  button.className = "close";
  button.setAttribute("data-dismiss", "alert");

  button.innerHTML = "&times;";

  div.appendChild(button);

  div.innerHTML += text;

  baseElement.appendChild(div);
}

function endpointCallback(fields, responseValues, alertContainer, response) {
  if (response.hasOwnProperty("error")) {
    if (response.error_type === "FieldError" || response.error_type === "NoFieldError") {
      var fieldName = fields[response.error_field],
          message = "Unknown error";

      if (fieldName !== null && fieldName !== undefined) {
        showAlert("alert-danger", fieldName + " " + response.message, alertContainer);
      } else {
        showAlert("alert-danger", "Sorry, something went wrong!", alertContainer);
        throw new Error("invalid response from server");
      }
    } else {
      showAlert("alert-danger", "Sorry, something went wrong!", alertContainer);
      throw new Error("unable to handle error `" + response.error_type + "' from server");
    }
  } else if (response.hasOwnProperty("result")) {
    var result = response.result,
        messages = [];

    for (var fieldName in responseValues) {
      var fieldValue = result[fieldName],
          name = fieldName;

      if (fieldValue === null || fieldValue === undefined) {
        showAlert("alert-danger", "Sorry, something went wrong!", alertContainer);
        throw new Error("field `" + fieldName + "' not found in response");
      }

      if (typeof(fieldValue) === "function") {
        name = fieldValue(fieldName);
      } else if (typeof(fieldValue) === "object") {
        if (fieldValue.hasOwnProperty("prefix")) {
          name = fieldValue.prefix + parsedValue;
        }

        if (fieldValue.hasOwnProperty("suffix")) {
          name += fieldValue.suffix;
        }
      }

      messages.push("<b>" + name + "</b>: " + fieldValue);
    }

    showAlert("alert-success", messages.join("<br />"), alertContainer);
  }
}

function defineEndpoint(name, label, fields, responseValues, form, alertContainer, addressOverride) {
  var endpoint = new FormEndpoint(name, label, Object.keys(fields)),
      formElement = document.getElementById(form),
      alertElement = document.getElementById(alertContainer);

  if (formElement === null || formElement === undefined) {
    throw new Error("missing form `" + form + "'");
  }

  if (alertElement === null || alertElement === undefined) {
    throw new Error("missing alert container `" + alertContainer + "'");
  }

  formElement.onsubmit = function(e) {
    e.preventDefault();

    var address = window.location.href;

    if (addressOverride !== null && addressOverride !== undefined) {
      address = addressOverride;
    }

    endpoint.request(address, endpointCallback.bind(null, fields, responseValues, alertElement));
  };
}
