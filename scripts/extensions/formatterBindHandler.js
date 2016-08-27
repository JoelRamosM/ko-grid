ko.bindingHandlers["formatter"] = {
    init: function () {

    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var format = ko.unwrap(valueAccessor());
        var text = ko.unwrap(allBindings.get("text")) || "";
        var nvalue;
        
        if(typeof format ==="function"){
            $(element).text(format(text));
            return;
        }        
        if(typeof format !=="string")
            return;
        
        //Brazilian person or company identifier      
        if (format === "cpfcnpj") {
            if (text.length === 11)
                nvalue = text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4");
            else if (text.length === 14)
                nvalue = text.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
            $(element).text(nvalue);
            return;
        }
        if (format === "date") {
            var dtStr = moment(text).format("DD/MM/YYYY");
            $(element).text(dtStr);
            return;
        }
        if (format === "dateTime") {
            var dtStr = moment(text).format("DD/MM/YYYY HH:mm");
            $(element).text(dtStr);
            return;
        }        
    }

};