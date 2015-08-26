function showAlert(clazz, text, baseElement) {
  var div = document.createElement('div');

  div.className = "alert " + clazz + " alert-dismissible";

  var button = document.createElement('span');

  button.className = "close";
  button.setAttribute("data-dismiss", "alert");

  button.innerHTML = "&times;";

  div.appendChild(button);

  div.innerHTML += text;

  baseElement.innerHTML = '';
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
          name = fieldName,
          nameValue = responseValues[name];

      if (fieldValue === null || fieldValue === undefined) {
        continue;
      }

      if (typeof(nameValue) === "function") {
        name = nameValue(fieldValue);
      } else if (typeof(nameValue) === "object") {
        if (nameValue.hasOwnProperty("prefix")) {
          name = nameValue.prefix + fieldValue;
        }

        if (nameValue.hasOwnProperty("suffix")) {
          name += nameValue.suffix;
        }
      } else {
        name = nameValue;
      }

      messages.push("<b>" + name + "</b>: " + fieldValue);
    }

    if (messages.length === 0) {
      showAlert("alert-warning", "No results from calculation", alertContainer);
    } else {
      showAlert("alert-success", messages.join("<br />"), alertContainer);
    }
  }
}

function defineEndpoint(name, label, fields, responseValues, form, alertContainer, addressOverride, portOverride) {
  var endpoint = new FormEndpoint(name, label, Object.keys(fields)),
      formElement = document.getElementById(form),
      alertElement = document.getElementById(alertContainer),
      $formElement = $(formElement),
      $submitButton = $formElement.find(":submit");

  if (formElement === null || formElement === undefined) {
    throw new Error("missing form `" + form + "'");
  }

  if (alertElement === null || alertElement === undefined) {
    throw new Error("missing alert container");
  }

  formElement.onsubmit = function(e) {
    e.preventDefault();

    var address = window.location.href,
        port = 4567

    if (addressOverride !== null && addressOverride !== undefined) {
      address = addressOverride;
    }

    if (portOverride !== null && portOverride !== undefined) {
      port = portOverride;
    }

    $submitButton.button("loading");

    endpoint.request(address, port, function(response) {
      $submitButton.button("reset");

      endpointCallback(fields, responseValues, alertElement, response);
    });
  };
}
