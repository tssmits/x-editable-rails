if (!EditableForm) {
  var EditableForm = $.fn.editableform.Constructor;
  EditableForm.prototype.saveWithUrlHook = function(value) {
    const originalUrl   = this.options.url;
    const { model }         = this.options;
    const nestedName    = this.options.nested;
    const nestedId      = this.options.nid;
    const nestedLocale  = this.options.locale;

    this.options.url = params => {
      if (typeof originalUrl === 'function') {
        return originalUrl.call(this.options.scope, params);
      } else if ((originalUrl != null) && (this.options.send !== 'never')) {
        const myName = params.name;
        const myValue = params.value;

        // if there are no values in a list, add a blank value so Rails knows all values were removed
        if ((Object.prototype.toString.call(params.value) === '[object Array]') && (params.value.length === 0)) {
          params.value.push("");
        }

        const obj = {};

        if (nestedName) {
          const nested          = {};
          nested[myName]  = myValue;
          nested['id']    = nestedId;

          if (nestedLocale) {
            nested['locale'] = nestedLocale;
          }

          obj[nestedName + '_attributes'] = nested;
        } else {
          obj[myName] = myValue;
        }

        params[model] = obj;

        delete params.name;
        delete params.value;
        delete params.pk;

        return $.ajax($.extend({
          url:      originalUrl,
          data:     params,
          type:     'PUT',
          dataType: 'json'
        }, this.options.ajaxOptions));
      }
    };

    return this.saveWithoutUrlHook(value);
  };

  EditableForm.prototype.saveWithoutUrlHook = EditableForm.prototype.save;
  EditableForm.prototype.save = EditableForm.prototype.saveWithUrlHook;
}
