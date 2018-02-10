$.fn.editable.defaults.error = function(response, newValue) {
  const field_name = $(this).data("name");
  const error_msgs = response.responseJSON.errors[field_name];
  return error_msgs.join("; ");
};
