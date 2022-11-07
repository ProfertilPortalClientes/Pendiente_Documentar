sap.ui.define([], function () {
	"use strict";
	return {

    formatDate: function (sDate) {

      var sYear = sDate.substr(0, 4);
      var sMonth = sDate.substr(-4, 2);
      var sday = sDate.substr(-2, 2);

      var sResultDate = sday + '/' + sMonth + '/' + sYear;

      return sResultDate;

    },

    getStatusQty: function (sQty) {
			//switch (s) {
      if (sQty>0) {
        return "Information";
      }
      else
      {
        return "None";
      }
				//return "Warning";

				//return "Success";

				//return "Error";

				//return "Information";
		},

    getStatusText: function(sQty){

      if (sQty>0) {
        return "Information";
      }
      else
      {
        return "None";
      }


    }

  };
},);
