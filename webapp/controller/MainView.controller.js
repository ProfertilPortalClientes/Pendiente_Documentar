sap.ui.define([
  "profertil/pendienteDocumentar/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/core/library",
  "sap/ui/core/Fragment"
], function(Controller, JSONModel, Filter, FilterOperator, MessageToast, MessageBox, CoreLibrary, Fragment) {
  "use strict";
  var oController;
  return Controller.extend("profertil.pendienteDocumentar.controller.MainView", {
    onInit: function () {
      // oController por si se necesita usar un "this" pero no se puede dependiendo del codigo
      oController = this;
      this.sTotal = 0;
      this.sTotalKB = 0;
      // JSON DE PENDIENTE DE DOCUMENTAR
      var oViewModel;
      oViewModel = new JSONModel({
        // Controlador que devuelve si es admin o no
        isAdmin: oController._isAdmin(),

        // Contadores de Lista para cuando cambies la vista
        NEGCount: 0,
        KBCount: 0,
        // Arrays para la lista del MultiComboBox de Venc de Pago
        NEGfechaVencPago: [],
        KBfechaVencPago: [],
      });


      this.setModel(oViewModel, "pendienteDocView");

      this.setRepoUrl();

    //   this.getkbSinFacturar();

    },
    _isAdmin: function () {
      // Deseleccionar y seleccionar el Return true para cambiar de admin a cliente
      //CUANDO DEPLOYAR SIEMPRE DEJAR "return true" COMENTADO Y EL OTRO RETURN DEJAR DESCOMENTADO
      return window.location.href.toLowerCase().includes("-admin");
      //return true;
    },

    // onAfterRendering: function() {
    //     var okbSinFacturar = this.getkbSinFacturar();
    //     okbSinFacturar.then( function (oData) {
            
    //     })
    // },

    // setModelokbSinFacturar: function (oDataReturn, oResponse) {
    //     var oModel = new sap.ui.model.json.JSONModel();
    //     // aDatos.results.forEach(oDato => {
    //     //     let okbSinFacturar = {
    //     //         BzirkTxt = oDato.BzirkTxt,
    //     //         CantLiq = oDato.CantLiq,
    //     //         MatnrTXT = oDato.MatnrTXT,
    //     //         acnegocio = oDato.acnegocio,
    //     //         acposicion = oDato.acposicion,
    //     //         bzirk = oDato.bzirk,
    //     //         centro = oDato.centro,
    //     //         kunnr = oDato.kunnr,
    //     //         material = oDato.material,
    //     //         plbstkd = oDato.plbstkd,
    //     //         plentrega = oDato.plentrega,
    //     //         plposicion = oDato.plposicion,
    //     //         precio = oDato.precio,
    //     //         producto = oDato.producto,
    //     //         remito = oDato.remito,
    //     //         tnpend = oDato.tnpend,
    //     //         vencpago = oDato.vencpago
    //     //     }
    //     //     oModel.setData(okbSinFacturar);
    //     // });
    //     oModel.setModel(oDataReturn.results)
    //     oController.getView().setModel(oModel,"modelokbSinFacturar")
    // },

    // getkbSinFacturar: function () {
    //     oController.getView().getModel().read("/kbSinFacturarSet", {
    //         success: function (oData) {
    //             var oModel = new sap.ui.model.json.JSONModel();
    //             oModel.setData(oData.results);
    //             oController.getView().setModel(oModel,"modelokbSinFacturar")
    //         }.bind(this)
    //     })
    // },

    onBeforeRebindTableKB: function (oEvent) {
      // Rebind de Tabla KB
      var oBindingParams = oEvent.getParameter("bindingParams");
      var oSmartFilter = this.getView().byId("smartFilterBarKB");
      var oBundle = this.getView().getModel("i18n").getResourceBundle();

        // Filtro bzirk zona
        var oSelect = oSmartFilter.getControlByKey("bzirk");
        var aSelectedKeys = oSelect.getSelectedKeys();
        for (var i = 0; i < aSelectedKeys.length ; i++ ){
          // Llama al back para filtrar por Zona
            var newFilter = new Filter("bzirk", FilterOperator.EQ, aSelectedKeys[i] );
            oBindingParams.filters.push(newFilter);

        }

        var oFecha = oSmartFilter.getControlByKey("vencpago");
        var aSelectedKeysFecha = oFecha.getSelectedKeys();

        //Filtro por fecha
        for (var j = 0; j < aSelectedKeysFecha.length ; j++ ){

          var sVencpago =  aSelectedKeysFecha[j].substr(6, 4) + aSelectedKeysFecha[j].substr(3, 2) + aSelectedKeysFecha[j].substr(0, 2);
          var NewFilterDate = new Filter("vencpago", FilterOperator.EQ, sVencpago );

          oBindingParams.filters.push(NewFilterDate);

        }
        this.byId("SubtotalRetiros").setText(oBundle.getText("cantidad.total", this.sTotalKB.toString()));
        if (this.sTotalKB > 0 && !isNaN(this.sTotalKB)) this.byId("bTnSendInformationRetiros").setEnabled(true); else this.byId("bTnSendInformationRetiros").setEnabled(false);
    },

    onBeforeRebindTableNEG: function (oEvent) {
      // Rebind de Tabla NEG
      var oBindingParams = oEvent.getParameter("bindingParams");
      var oSmartFilter = this.getView().byId("smartFilterBarNEG");
      var oBundle = this.getView().getModel("i18n").getResourceBundle();
        // filtro bzirk zona
        var oSelect = oSmartFilter.getControlByKey("Bzirk");
        var aSelectedKeys = oSelect.getSelectedKeys();

        for (var i = 0; i < aSelectedKeys.length ; i++ )
        {
          // Llama al back para filtrar por Zona
            var newFilter = new Filter("Bzirk", FilterOperator.EQ, aSelectedKeys[i] );
            oBindingParams.filters.push(newFilter);

        }

        var oFecha = oSmartFilter.getControlByKey("BstdkE");
        var aSelectedKeysFecha = oFecha.getSelectedKeys();

        //Filtro por fecha
        for (var j = 0; j < aSelectedKeysFecha.length ; j++ ){

          var sBstdkE =  aSelectedKeysFecha[j].substr(6, 4) + aSelectedKeysFecha[j].substr(3, 2) + aSelectedKeysFecha[j].substr(0, 2);
          var NewFilterDate = new Filter("BstdkE", FilterOperator.EQ, sBstdkE );

          oBindingParams.filters.push(NewFilterDate);
        }
        this.byId("SubtotalNegocios").setText(oBundle.getText("cantidad.total", this.sTotal.toString()));
        if (this.sTotal > 0 && !isNaN(this.sTotal)) this.byId("bTnSendInformation").setEnabled(true); else this.byId("bTnSendInformation").setEnabled(false);
    },

   onChangeFechaDesde: function(oEvent){
      this.fechaDesde = oEvent.getSource().getDateValue();      
    },

    onChangeFechaHasta: function(oEvent){
     this.fechaHasta = oEvent.getSource().getDateValue();      
      if (this.fechaDesde && this.fechaHasta){
        sap.ui.getCore().byId("tiposCambio").rebindTable(); 
        // this.onBeforeRebindTableCambio();
      }else {
        MessageToast.show("Fecha Desde y Fecha Hasta son obligatorias");
      }
    },
    
    onBeforeRebindTableCambio: function (oEvent) {
      var oBindingParams = oEvent.getParameter("bindingParams");
      var NewFilterDate = new Filter("FROM_DATE", FilterOperator.EQ, this.fechaDesde );
      var NewFilterDateHasta = new Filter("TO_DATE", FilterOperator.EQ, this.fechaHasta );
      oBindingParams.filters.push(NewFilterDate);
      oBindingParams.filters.push(NewFilterDateHasta);
      // sap.ui.getCore().byId("TablaTipoCambio").rebindTable();
      
    },

    handleClose: function(oEvent){
      this.oDialogTipoCambio.close();
    },

    onTableUpdateFinishedNEG: function(oEvent){
      // Si la actualizacion de Tabla de Negocio termina pasa esto:
      // Se obtiene el modelo, se carga en una variable la cantidad de registros que hay y por ultimo se mete dentro del JSONModel "pendienteDocView"
      var oModel = this.getModel("pendienteDocView");
      var NEGNumber = this.getView().byId("TablaNEGSinFacturar").getBinding("items").getLength();
      oModel.setProperty("/NEGCount", NEGNumber);

      // Consigo los items en forma de array desde el oEvent de Table Finished
      const isGroupHeader = (oItem) => {
        return oItem instanceof sap.m.GroupHeaderListItem;
    };


    var oTable = oEvent.getSource(),
        aItems = oTable.getItems(),
        aEntities = aItems.filter((oItem) => !isGroupHeader(oItem)).map((oItem) => oItem.getBindingContext().getObject());
        // Seteo el array para las fechas
    var arVencPagos = [],

        // Boolean para chequear si el siguiente valor esta repetido en el array dentro de otra funcion
        search;
        // For para todas las entidades
      for (var i = 0; i < aEntities.length; i++)
      {
        if (aEntities[i].CantLiq != 0)
        {
          aItems[i].removeStyleClass("customStyle");
          aItems[i].addStyleClass("customStyle");
        }
        else
        {
          aItems[i].removeStyleClass("customStyle");
        }
        var sYear = aEntities[i].BstdkE.substr(0, 4);
        var sMonth = aEntities[i].BstdkE.substr(-4, 2);
        var sday = aEntities[i].BstdkE.substr(-2, 2);

        var sResultDate = sday + '/' + sMonth + '/' + sYear;

        // Cargo datos de Key y Texto para el MultiComboBox
        var oVencPagos = {
          fechaKey: sResultDate,
          fechaText: sResultDate

        };

        // El boolean pasa por otra funcion que chequea si esta repetida en el array y si esta repetido devuelve un true
        search = this.buscarFechaIgual(oVencPagos.fechaKey, arVencPagos);
        // Chequea si es true y en el caso que si agrega el dato al array
        if (!search)
        {
          arVencPagos.push(oVencPagos);
        }
      }

      // Se carga al JSONModel
      this.getModel("pendienteDocView").setProperty("/NEGfechaVencPago", arVencPagos);
    },

    onTableUpdateFinishedKB: function(oEvent){
      // Si la actualizacion de Tabla de KB termina pasa esto:
      // Se obtiene el modelo, se carga en una variable la cantidad de registros que hay y por ultimo se mete dentro del JSONModel "pendienteDocView"
      var oModel = this.getModel("pendienteDocView");
      var KBNumber = this.getView().byId("TablaKBSinFacturar").getBinding("items").getLength();
      oModel.setProperty("/KBCount", KBNumber);
       // Consigo los items en forma de array desde el oEvent de Table Finished
      const isGroupHeader = (oItem) => {
        return oItem instanceof sap.m.GroupHeaderListItem;
    };

      var oTable = oEvent.getSource(),
      aItems = oTable.getItems(),
      aEntities = aItems.filter((oItem) => !isGroupHeader(oItem)).map((oItem) => oItem.getBindingContext().getObject());
      // Seteo el array para las fechas
      var arVencPagos = [],

      // Boolean para chequear si el siguiente valor esta repetido en el array dentro de otra funcion
      search;
      // For para todas las entidades
      for (var i = 0; i < aEntities.length; i++)
      {
        if (aEntities[i].CantLiq != 0)
        {
          aItems[i].removeStyleClass("customStyle");
          aItems[i].addStyleClass("customStyle");
        }
        else
        {
          aItems[i].removeStyleClass("customStyle");
        }
        var sYear = aEntities[i].vencpago.substr(0, 4);
        var sMonth = aEntities[i].vencpago.substr(-4, 2);
        var sday = aEntities[i].vencpago.substr(-2, 2);

        var sResultDate = sday + '/' + sMonth + '/' + sYear;

        // Cargo datos de Key y Texto para el MultiComboBox
        var oVencPagos = {
          //fechaKey: oFormatKey.format(aEntities[i].vencpago),
          //fechaText: oFormatText.format(aEntities[i].vencpago)
          fechaKey: sResultDate,
          fechaText: sResultDate

        };
        // El boolean pasa por otra funcion que chequea si esta repetida en el array y si esta repetido devuelve un true
        search = this.buscarFechaIgual(oVencPagos.fechaKey, arVencPagos);
        // Chequea si es true y en el caso que si agrega el dato al array
        if (!search)
        {
          arVencPagos.push(oVencPagos);
        }

      }
    // Se carga al JSONModel
    this.getModel("pendienteDocView").setProperty("/KBfechaVencPago", arVencPagos);
    },

    buscarFechaIgual: function(fecha, array)
    {
      // Funcion que chequea si esta repetida en el array y si esta repetido devuelve un true
      for (var i = 0; i < array.length; i++)
      {
        if (fecha == array[i].fechaKey)
        {
          return true;
        }
      }
    },

    onSubmitCantLiqRetiros: function(oEvent) {

      var oModel = this.getView().getModel();
      var oPath = oEvent.getSource().getParent().getBindingContextPath();
      var oData = oModel.getProperty(oPath);
      var oBundle = this.getView().getModel("i18n").getResourceBundle();
      // Se carga en una variable las toneladas pendientes de la tabla de negocio
      var Toneladas = oData.tnpend;
      // Chequea si tiene informacion o no porque en el caso que no tenga entonces probablemente vino de la tabla de KB
      // if (Toneladas == null) Toneladas = oData.NoEntreNoFac;

      var oModelPendienteDoc = this.getView().getModel("pendienteDocView");
      var sAdmin = oModelPendienteDoc.getProperty("/isAdmin");
      var aFila = oEvent.getSource().getParent().getBindingContext().getObject();
      var aTablaSinFacturarRetiros = this.getView().byId("TablaKBSinFacturar").getItems();
      var inputValue = oEvent.mParameters.value;
      var sTotal = 0;
      var aLine;
      var sTotalKB = 0;
      var cantLiqSum = 0;
      var aLine;

      if (parseFloat(inputValue) > Toneladas)
        {
          // En el caso que si cambia el valor del input seleccionado a 0 y aparece el mensaje de que no puede ser mayor a las toneladas pendientes
          oEvent.getSource().setValue("0.00");
          MessageToast.show(oBundle.getText("message.cantidadSuperaLiquidada"));
          oModelPendienteDoc.setProperty("/RetiroArktx", );
          oModelPendienteDoc.setProperty("/Retirokunnr", );

          for (var h = 0; h < aTablaSinFacturarRetiros.length; h++) {

            var aItem = aTablaSinFacturarRetiros[h].getBindingContext().getObject();

            if (aItem.acnegocio === oData.acnegocio)
            {
              this.byId("SubtotalRetiros").setText(oBundle.getText("cantidad.total", sTotal.toString()));
              if (sTotal > 0 && !isNaN(sTotal)) this.byId("bTnSendInformationRetiros").setEnabled(true); else this.byId("bTnSendInformationRetiros").setEnabled(false);
                aTablaSinFacturarRetiros[h].getCells()[12].setValueState(sap.ui.core.ValueState.Error);
                aTablaSinFacturarRetiros[h].removeStyleClass("customStyle");
            }

          }

        }
        else
        {
          var sMaterialSeleccionado = "";
          var sKunnr = "";
          sKunnr = oModelPendienteDoc.getProperty("/Retirokunnr");
          sMaterialSeleccionado = oModelPendienteDoc.getProperty("/RetiroArktx");

          if (aFila.producto != sMaterialSeleccionado && sMaterialSeleccionado != undefined ) {
            MessageToast.show(oBundle.getText("message.productoDuplicado"));
            oEvent.getSource().setValue("0.00");
            return;
          }

          if (aFila.kunnr != sKunnr && sKunnr != undefined ) {
            MessageToast.show("Solo se puede seleccionar un cliente");
            oEvent.getSource().setValue("0.00");
            return;
          }

          if (inputValue > 0 && inputValue != "")
          {
            //Grabar en el modelo la descripción cargada
            oModelPendienteDoc.setProperty("/RetiroArktx", aFila.producto);
            oModelPendienteDoc.setProperty("/Retirokunnr", aFila.kunnr);
          }

          else
          {
            //Limpiar valor descripción
            //oEvent.getSource().setValue("0.00");
            oModelPendienteDoc.setProperty("/RetiroArktx", );
            oModelPendienteDoc.setProperty("/Retirokunnr", );
          }

          sTotal = 0;
          var sError = "";
          for (var j = 0; j < aTablaSinFacturarRetiros.length; j++)
          {
            aLine = aTablaSinFacturarRetiros[j].getBindingContext().getObject();
            if (aLine.centro != oData.centro || aLine.acnegocio != oData.acnegocio || aLine.material != oData.material || aLine.precio != oData.precio || aLine.remito != oData.remito || aLine.tnpend != oData.tnpend)
            {
              if (aLine.CantLiq){
                sTotalKB += parseFloat(aLine.CantLiq);
              }
            }
          }
          for (var i = 0; i < aTablaSinFacturarRetiros.length; i++) {
            aLine = aTablaSinFacturarRetiros[i].getBindingContext().getObject();
              sError = aTablaSinFacturarRetiros[i].getCells()[12].getValueState();

              if (sError === "Error") {

                aTablaSinFacturarRetiros[i].getCells()[12].setValueState("None");
                aTablaSinFacturarRetiros[i].removeStyleClass("customStyle");

              }
              if (aLine.acposicion == oData.acposicion && aLine.acnegocio == oData.acnegocio && aLine.plentrega == oData.plentrega && aLine.plposicion == oData.plposicion && aLine.remito == oData.remito)
              {
              if (inputValue > 0 && inputValue != "")
                {
                  cantLiqSum = parseFloat(sTotalKB) + parseFloat(inputValue);
                  sTotal += parseFloat(cantLiqSum);
                  aTablaSinFacturarRetiros[i].removeStyleClass("customStyle");
                  aTablaSinFacturarRetiros[i].addStyleClass("customStyle");

                }
                else
                {
                  cantLiqSum = parseFloat(sTotalKB);
                  sTotal += parseFloat(cantLiqSum);
                  // Inicializar la fila cuando el campo tiene un "vacío"
                  //aTablaSinFacturarRetiros[i].getCells()[11].setValue("0.00");
                  aTablaSinFacturarRetiros[i].removeStyleClass("customStyle");

                }
              }

          }
        this.sTotalKB = sTotal;
        this.byId("SubtotalRetiros").setText(oBundle.getText("cantidad.total.retiros", sTotal.toString()));
        if (!isNaN(sTotal)) this.byId("SubtotalRetiros").setText(oBundle.getText("cantidad.total", sTotal.toString())); else this.byId("SubtotalRetiros").setText("Cantidad Total: ");
        if (sTotal > 0 && !isNaN(sTotal)) this.byId("bTnSendInformationRetiros").setEnabled(true); else this.byId("bTnSendInformationRetiros").setEnabled(false);
        }
    },

    onClearInputRetiros: function(oEvent){
      var oModel = this.getView().getModel();
      var oPath = oEvent.getSource().getParent().getBindingContextPath();
      var oData = oModel.getProperty(oPath);
      var aTablaSinFacturar = this.getView().byId("TablaKBSinFacturar").getItems();
      var inputValue = oEvent.mParameters.value;
        for (var i = 0; i < aTablaSinFacturar.length; i++) {
            var aLine = aTablaSinFacturar[i].getBindingContext().getObject();
          if (aLine.acnegocio == oData.acnegocio && aLine.material == oData.material &&
              aLine.precio == oData.precio && aLine.centro == oData.centro && aLine.kunnr == oData.kunnr
              && aLine.BzirkTxt == oData.BzirkTxt)
            {
                if (inputValue == "" || inputValue == null || inputValue == 0)
                {
                    aTablaSinFacturar[i].getCells()[11].setValue("0.00");
                    aTablaSinFacturar[i].getCells()[11].setValueState("None");
                }
            }
        }
    },

    onSubmitCantLiq: function(oEvent){

      var oModel = this.getView().getModel();
      var oPath = oEvent.getSource().getParent().getBindingContextPath();
      var oData = oModel.getProperty(oPath);
      var oBundle = this.getView().getModel("i18n").getResourceBundle();

      // Se carga en una variable las toneladas pendientes de la tabla de negocio
      var Toneladas = oData.tnpend;
      // Chequea si tiene informacion o no porque en el caso que no tenga entonces probablemente vino de la tabla de KB
      if (Toneladas == null) Toneladas = oData.NoEntreNoFac;

      var oModelPendienteDoc = this.getView().getModel("pendienteDocView");
      var sAdmin = oModelPendienteDoc.getProperty("/isAdmin");
      var aFila = oEvent.getSource().getParent().getBindingContext().getObject();
      var aTablaSinFacturar = this.getView().byId("TablaNEGSinFacturar").getItems();
      var inputValue = oEvent.mParameters.value;
      var sTotal = 0;
      var sTotalNEG = 0;
      var cantLiqSum = 0;
      var aLine;

      if (parseFloat(inputValue) > Toneladas)
        {
          // En el caso que si cambia el valor del input seleccionado a 0 y aparece el mensaje de que no puede ser mayor a las toneladas pendientes
          oEvent.getSource().setValue("0.00");
          MessageToast.show(oBundle.getText("message.cantidadSuperaLiquidada"));
          oModelPendienteDoc.setProperty("/NegocioArktx", );
          oModelPendienteDoc.setProperty("/kunnr",);
          this.byId("SubtotalNegocios").setText(oBundle.getText("cantidad.total", sTotal.toString()));
          if (sTotal > 0 && !isNaN(sTotal)) this.byId("bTnSendInformation").setEnabled(true); else this.byId("bTnSendInformation").setEnabled(false);
          for (var h = 0; h < aTablaSinFacturar.length; h++) {

            var aItem = aTablaSinFacturar[h].getBindingContext().getObject();

            if (aItem.Vbeln === oData.Vbeln && aItem.Posnr === oData.Posnr)
            {

                aTablaSinFacturar[h].getCells()[11].setValueState("Error");
                aTablaSinFacturar[h].removeStyleClass("customStyle");

            }

          }

        }
        else
        {
          var sMaterialSeleccionado = "";
          var sKunnr = "";
          sMaterialSeleccionado = oModelPendienteDoc.getProperty("/NegocioArktx");
          sKunnr = oModelPendienteDoc.getProperty("/kunnr");
          if (aFila.Arktx != sMaterialSeleccionado && sMaterialSeleccionado != undefined ) {
            MessageToast.show(oBundle.getText("message.productoDuplicado"));
            oEvent.getSource().setValue("0.00");
            return;
          }


          if (aFila.Kunnr != sKunnr && sKunnr != undefined ) {
            MessageToast.show("Solo se puede seleccionar un cliente");
            oEvent.getSource().setValue("0.00");
            return;
          }

         if (inputValue > 0 && inputValue != "")
          {
            //Grabar en el modelo la descripción cargada
            oModelPendienteDoc.setProperty("/NegocioArktx", aFila.Arktx);
            oModelPendienteDoc.setProperty("/kunnr", aFila.Kunnr);
          }
          else
          {
            //Limpiar valor descripción
            //oEvent.getSource().setValue("0.00");
            oModelPendienteDoc.setProperty("/NegocioArktx", );
            oModelPendienteDoc.setProperty("/kunnr",);
          }
          var sError = "";
          for (var j = 0; j < aTablaSinFacturar.length; j++)
          {
            aLine = aTablaSinFacturar[j].getBindingContext().getObject();
            if (aLine.Kunnr != oData.Kunnr || aLine.Vbeln != oData.Vbeln || aLine.Arktx != oData.Arktx || aLine.Netpr != oData.Netpr || aLine.NoEntreNoFac != oData.NoEntreNoFac || aLine.TotAcuerdo != oData.TotAcuerdo)
            {
              if (aLine.CantLiq){
                sTotalNEG += parseFloat(aLine.CantLiq);
              }
            }
          }
          for (var i = 0; i < aTablaSinFacturar.length; i++) {
            aLine = aTablaSinFacturar[i].getBindingContext().getObject();

              sError = aTablaSinFacturar[i].getCells()[10].getValueState();
              if (sError === "Error") {

                  aTablaSinFacturar[i].getCells()[10].setValueState("None");
                  aTablaSinFacturar[i].removeStyleClass("customStyle");

              }
              if (aLine.Vbeln == oData.Vbeln && aLine.Posnr == oData.Posnr)
              {
                if (inputValue > 0 && inputValue != "")
                    {
                    cantLiqSum = parseFloat(sTotalNEG) + parseFloat(inputValue);
                    sTotal += parseFloat(cantLiqSum);
                    aTablaSinFacturar[i].removeStyleClass("customStyle");
                    aTablaSinFacturar[i].addStyleClass("customStyle");
                    }
                    else
                    {
                    cantLiqSum = parseFloat(sTotalNEG);
                    sTotal += parseFloat(cantLiqSum);
                    aTablaSinFacturar[i].removeStyleClass("customStyle");
                    }
            }
          }
        this.sTotal = sTotal;
        if (!isNaN(sTotal)) this.byId("SubtotalNegocios").setText(oBundle.getText("cantidad.total", sTotal.toString())); else this.byId("SubtotalNegocios").setText("Cantidad Total: ");
        if (sTotal > 0 && !isNaN(sTotal)) this.byId("bTnSendInformation").setEnabled(true); else this.byId("bTnSendInformation").setEnabled(false);
        }
    },

    onClearInput: function(oEvent){
      var oModel = this.getView().getModel();
      var oPath = oEvent.getSource().getParent().getBindingContextPath();
      var oData = oModel.getProperty(oPath);
      var aTablaSinFacturar = this.getView().byId("TablaNEGSinFacturar").getItems();
      var inputValue = oEvent.mParameters.value;
        for (var i = 0; i < aTablaSinFacturar.length; i++) {
          var aLine = aTablaSinFacturar[i].getBindingContext().getObject();
          if (aLine.Vbeln == oData.Vbeln && aLine.Arktx == oData.Arktx &&
              aLine.Netpr == oData.Netpr && aLine.Werks == oData.Werks && aLine.Kunnr == oData.Kunnr
              && aLine.BzirkTxt == oData.BzirkTxt)
              {
                if (inputValue == "" || inputValue == null || inputValue == 0)
                {
                  aTablaSinFacturar[i].getCells()[10].setValue("0.00");
                  aTablaSinFacturar[i].getCells()[10].setValueState("None");
                }
              }
        }
    },

    onEnviarCabeceraNegocios: function(oEvent){
      var aTablaSinFacturar = this.getView().byId("TablaNEGSinFacturar").getItems();
      for (var i = 0; i < aTablaSinFacturar.length; i++) {
        if (aTablaSinFacturar[i].aCustomStyleClasses) {
          this._Cliente = aTablaSinFacturar[i].getBindingContext().getObject().Kunnr;
          // this._Prioridad = aTablaSinFacturar[i].getBindingContext().getObject().Prioridad;
        }
      }
    if (!this.oDialogComentNegocios) {

					this.oDialogComentNegocios = sap.ui.xmlfragment("profertil.pendienteDocumentar.view.fragments.cabecera_negocios", this);
					this.getView().addDependent(this.oDialogComentNegocios);

				}

				this.oDialogComentNegocios.open();
    },

    onEnviarCabeceraRetiros: function(oEvent){
      var aTablaSinFacturarRetiros = this.getView().byId("TablaKBSinFacturar").getItems();
      for (var i = 0; i < aTablaSinFacturarRetiros.length; i++) {
        if (aTablaSinFacturarRetiros[i].aCustomStyleClasses) {
          this._Cliente = aTablaSinFacturarRetiros[i].getBindingContext().getObject().kunnr;
          // this._Prioridad = aTablaSinFacturarRetiros[i].getBindingContext().getObject().Prioridad;
        }
      }
      if (!this.oDialogComentRetiros) {

        this.oDialogComentRetiros = sap.ui.xmlfragment("profertil.pendienteDocumentar.view.fragments.cabecera_retiros", this);
        this.getView().addDependent(this.oDialogComentRetiros);

      }

      this.oDialogComentRetiros.open();
  },

    handleGuardarNegocios: function(oEvent){
     var oBundle = this.getView().getModel("i18n").getResourceBundle();
     var sHeaderDate = sap.ui.getCore().byId("fechaCabeceraNegocios").getDateValue();
     var sHeaderNroLiquidacion = sap.ui.getCore().byId("inputNroLiquidacionNegocios").getValue();
     var sHeaderComision = sap.ui.getCore().byId("inputTipoComisionNegocios").getValue();
     var sHeaderTipoCambio = sap.ui.getCore().byId("inputTipoCambioNegocios").getValue();
     var oModelPendienteDoc = this.getView().getModel("pendienteDocView");
     var sAdmin = oModelPendienteDoc.getProperty("/isAdmin");
     var that = this;

      if (!sHeaderDate) {
        MessageToast.show(oBundle.getText("messageLiquidaciones.Fecha"));
					return;
      }

      if (!sHeaderNroLiquidacion) {
        MessageToast.show(oBundle.getText("messageLiquidaciones.nroLiquidacion"));
					return;
      }

      if (!sHeaderTipoCambio) {
        MessageToast.show(oBundle.getText("messageLiquidaciones.tipoCambio"));
					return;
      }

      if (!sHeaderComision) {
        MessageToast.show(oBundle.getText("messageLiquidaciones.comision"));
					return;
      }
      //Validar cantidad de archivos de liquidación

      var sCantLiq = sap.ui.getCore().byId("UploadSetLiquidaciones").getItems().length;
    //   var sCantLiq = 0;
    //   for (var l = 0; l < aLiquidaciones.length; l++) {
    //    sCantLiq += 1;
    //  }

     if (sCantLiq < 1) {
       MessageToast.show(oBundle.getText("messageLiquidaciones.Archivos"));
       return;
     }

     var sCantLiqComprobantes = sap.ui.getCore().byId("UploadSetComprobantes").getItems().length;
      if (sCantLiqComprobantes < 1) {
      MessageToast.show("Para guardar la liquidacion, necesita un documento de comprobante");
      return;
      }

      //Formatear fecha liquidación
      //var start_date = sap.ui.getCore().getModel("appView").getProperty("/dateValue");
      var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyyMMdd" });
      var date = new Date(sHeaderDate);
      var dateStr = dateFormat.format(date);
      //console.log(dateStr);

        var sFechaLiq = dateStr;

        var oModel = this.getView().getModel();
        oModel.setUseBatch(false);

        var aTablaNegocios = this.getView().byId("TablaNEGSinFacturar").getItems();

        var aTo_header = {
          FechaLP: sFechaLiq.toString(),
          NroLP: sHeaderNroLiquidacion.toString(),
          TipoCambio: sHeaderTipoCambio.toString(),
          Comision: sHeaderComision.toString(),
          Cliente: this._Cliente.toString(),
          // Prioridad: this._Prioridad.toString(),
          Transaccion: "VA31",
          PosLiquidacionSet: []
        };

        var sLoad = false;
        var sCliente = "";
        for (var i = 0; i < aTablaNegocios.length; i++) {
          var aLine = aTablaNegocios[i].getBindingContext().getObject();

          if (aLine.CantLiq>0) {

              //Se carga un cliente seleccionado
              sCliente = aLine.Kunnr;
              sLoad = true;

              var aRow = {
                Documento: aLine.Vbeln.toString(),
                Producto: aLine.Arktx.toString(),
                Presentacion: aLine.KondmTxt.toString(),
                Precio: aLine.Netpr.toString(),
                VencPago: aLine.BstdkE.toString(),
                CantFact: aLine.CantLiq.toString(),
                Tipo: "NEG",
                NroLiq: sHeaderNroLiquidacion.toString(),
                FechaLiq: sFechaLiq.toString(),
                TipoCambioLiq: sHeaderTipoCambio.toString(),
                ComisionLiq: sHeaderComision.toString()
              };

              // add the communications to the user entity
              aTo_header.PosLiquidacionSet.push(aRow);

            }

            }

            if (sLoad == true)
            {
              oModel.create("/DocHeaderSet", aTo_header,
              {
               success: function(result)
               {

                var iD = result.Id;

                if (sAdmin) {
                  //Si es admin se toma el cliente de la tabla
                  sCliente = sCliente;
                }
                else
                {
                  //Si es cliente se toma el cliente que viene de backend
                  sCliente = result.Cliente;
                }

                oController.uploadFiles(sCliente.toString(), iD.toString());
                MessageToast.show(oBundle.getText("messageNegocios.msjOk"));
                oController.sTotal = 0;
                that.getView().byId("negSinFacturar").rebindTable();
                for (var j = 0; j < aTablaNegocios.length; j++) {
                  aTablaNegocios[j].removeStyleClass("customStyle");
                  aTablaNegocios[j].getCells()[10].setValue("0.00");
                }
              }.bind(this),

              error: function(err){
                 MessageToast.show(oBundle.getText("messageNegocios.msjNoOk"));
               },
                 async: true,
                 urlParameters: {}
               });

            }

            else

            {
              MessageToast.show(oBundle.getText("message.cargarCantidad"));
            }

    },

    UploadSetBeforeAddFile: function(oEvent){
      debugger;

    },

    handleGuardarRetiros: function(oEvent){
      var oBundle = this.getView().getModel("i18n").getResourceBundle();
      var sHeaderDate = sap.ui.getCore().byId("fechaCabeceraRetiros").getDateValue();
      var sHeaderNroLiquidacion = sap.ui.getCore().byId("inputNroLiquidacionRetiros").getValue();
      var sHeaderComision = sap.ui.getCore().byId("inputTipoComisionRetiros").getValue();
      var sHeaderTipoCambio = sap.ui.getCore().byId("inputTipoCambioRetiros").getValue();
      var oModelPendienteDoc = this.getView().getModel("pendienteDocView");
      var sAdmin = oModelPendienteDoc.getProperty("/isAdmin");
      var that = this;

      if (!sHeaderDate){
        MessageToast.show(oBundle.getText("messageLiquidaciones.Fecha"));
        return;
      }
       if (!sHeaderDate) {
         MessageToast.show(oBundle.getText("messageLiquidaciones.Fecha"));
           return;
       }

       if (!sHeaderNroLiquidacion) {
         MessageToast.show(oBundle.getText("messageLiquidaciones.nroLiquidacion"));
           return;
       }

       if (!sHeaderTipoCambio) {
         MessageToast.show(oBundle.getText("messageLiquidaciones.tipoCambio"));
           return;
       }

       if (!sHeaderComision) {
         MessageToast.show(oBundle.getText("messageLiquidaciones.comision"));
           return;
       }

       debugger;
       var sCantLiq = sap.ui.getCore().byId("UploadSetLiquidacionesRetiros").getItems().length;

       if (sCantLiq>1) {
        MessageToast.show(oBundle.getText("messageLiquidaciones.Archivos"));
        return;
      }

      var sCantComp = sap.ui.getCore().byId("UploadSetComprobantesRetiros").getItems().length;

       if (sCantComp < 1) {
        MessageToast.show("Para guardar la liquidacion, necesita un documento de comprobante");
        return;
      }

       //Formatear fecha liquidación
       var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyyMMdd" });
       var date = new Date(sHeaderDate);
       var dateStr = dateFormat.format(date);

         var sFechaLiq = dateStr;

         var oModel = this.getView().getModel();
         oModel.setUseBatch(false);

         var aTablaRetiros = this.getView().byId("TablaKBSinFacturar").getItems();

         var aTo_header = {
           FechaLP: sFechaLiq.toString(),
           NroLP: sHeaderNroLiquidacion.toString(),
           TipoCambio: sHeaderTipoCambio.toString(),
           Comision: sHeaderComision.toString(),
           Cliente: this._Cliente.toString(),
          //  Prioridad: this._Prioridad.toString(),
           Transaccion: "VA01",
           PosLiquidacionSet: []
         };

         var sLoad = false;
         var sCliente = "";

         for (var i = 0; i < aTablaRetiros.length; i++) {
           var aLine = aTablaRetiros[i].getBindingContext().getObject();

           if (aLine.CantLiq>0) {

             //Se carga un cliente seleccionado
             sCliente = aLine.kunnr;

              sLoad = true;

               var aRow =
               {
                 Documento: aLine.acnegocio.toString(),
                 Producto: aLine.material.toString(),
                 Presentacion: aLine.producto.toString(),
                 Precio: aLine.precio.toString(),
                 VencPago: aLine.vencpago.toString(),
                 CantFact: aLine.CantLiq.toString(),
                 Tipo: "KB",
                 NroLiq: sHeaderNroLiquidacion.toString(),
                 FechaLiq: sFechaLiq.toString(),
                 TipoCambioLiq: sHeaderTipoCambio.toString(),
                 ComisionLiq: sHeaderComision.toString(),
                 Plentrega: aLine.plentrega.toString(),
               };

               aTo_header.PosLiquidacionSet.push(aRow);

              }

          }

            if (sLoad == true)
            {
              oModel.create("/DocHeaderSet", aTo_header,
              {
               success: function(result)
               {

                var iD = result.Id;

                if (sAdmin) {
                  //Si es admin se toma el cliente de la tabla
                  sCliente = sCliente;
                }

                else

                {
                  //Si es cliente se toma el cliente que viene de backend
                  sCliente = result.Cliente;
                }

                oController.uploadFilesRetiros(sCliente.toString(), iD.toString());
                MessageToast.show(oBundle.getText("messageNegocios.msjOk"));
                oController.sTotalKB = 0;
                that.getView().byId("kbSinFacturar").rebindTable();
                for (var j = 0; j < aTablaRetiros.length; j++) {
                  aTablaRetiros[j].removeStyleClass("customStyle");
                  aTablaRetiros[j].getCells()[11].setValue("0.00");
                }
              },

              error: function(err){
                 MessageToast.show(oBundle.getText("messageNegocios.msjNoOk"));
               },
                 async: true,
                 urlParameters: {}
               });

            }

            else

            {
              MessageToast.show(oBundle.getText("message.cargarCantidad"));
            }
            // this.oDialogComentRetiros.close();
     },


     uploadFilesRetiros: function (client, sNroLiquidacion) {
      var file, filename;

      this.getClientFolder(client)
          .then(() => {
              return this.getClaimFolder(client, sNroLiquidacion);
          })
          .catch(() => {
              return this.getClaimFolder(client, sNroLiquidacion);
          })
          .then(() => {
              var items         = sap.ui.getCore().byId("UploadSetLiquidacionesRetiros").getItems();
              var aComprobantes = sap.ui.getCore().byId("UploadSetComprobantesRetiros").getItems();
              this.handleCancelRetiros();
              var path = "/" + client + "/" + sNroLiquidacion;

              for (var i = 0; i < items.length; i++) {
                  file = items[i].getFileObject();
                  filename = "LIQUIDACION_" + file.name;

                  this.uploadSingleFile(file, filename, path);

              }

              // var aComprobantes = sap.ui.getCore().byId("UploadSetComprobantesRetiros").getItems();

              for (var c = 0; c < aComprobantes.length; c++) {
                  file = aComprobantes[c].getFileObject();
                  filename = "COMPROBANTE_" + file.name;

                  this.uploadSingleFile(file, filename, path);

              }



          });
    },

      uploadFiles: function (client, sNroLiquidacion) {
        var file, filename;

        this.getClientFolder(client)
            .then(() => {
                return this.getClaimFolder(client, sNroLiquidacion);
            })
            .catch(() => {
                return this.getClaimFolder(client, sNroLiquidacion);
            })
            .then(() => {
                var items = sap.ui.getCore().byId("UploadSetLiquidaciones").getItems();
                var aComprobantes = sap.ui.getCore().byId("UploadSetComprobantes").getItems();
                this.handleCancelNegocios();
                var path = "/" + client + "/" + sNroLiquidacion;

                for (var i = 0; i < items.length; i++) {
                    file = items[i].getFileObject();
                    filename = "LIQUIDACION_" + file.name;

                    this.uploadSingleFile(file, filename, path);

                }

                for (var c = 0; c < aComprobantes.length; c++) {
                    file = aComprobantes[c].getFileObject();
                    filename = "COMPROBANTE_" + file.name;

                    this.uploadSingleFile(file, filename, path);

                }

            });
      },

    getClientFolder: function (client) {
        return this.createFolder(client);
    },

    getClaimFolder: function (client, claim) {
        return this.createFolder(claim, "/" + client);
    },

    uploadSingleFile: function (file, filename, path) {
        var data = new FormData();
        var dataObject = {
            "cmisaction": "createDocument",
            "propertyId[0]": "cmis:name",
            "propertyId[1]": "cmis:objectTypeId",
            "propertyValue[0]": filename,
            "propertyValue[1]": "cmis:document",
            "media": file,
        };

        var keys = Object.keys(dataObject);

        for (var key of keys) {
            data.append(key, dataObject[key]);
        }

        $.ajax({
            url: this._dmsUrl + path,
            type: "POST",
            data: data,
            contentType: false,
            processData: false
        });
    },

    createFolder: function (foldername, path) {
        var data = new FormData();
        var dataObject = {
            "cmisaction": "createFolder",
            "propertyId[0]": "cmis:name",
            "propertyId[1]": "cmis:objectTypeId",
            "propertyValue[0]": foldername,
            "propertyValue[1]": "cmis:folder"
        };

        var keys = Object.keys(dataObject);

        for (var key of keys) {
            data.append(key, dataObject[key]);
        }

        return $.ajax({
            url: this._dmsUrl + (!path ? "" : path),
            type: "POST",
            data: data,
            contentType: false,
            processData: false
        });
    },

    getDMSUrl: function (sPath) {
        var sComponent = this.getOwnerComponent().getManifest()["sap.app"]["id"];
        return jQuery.sap.getModulePath(sComponent) + sPath;
    },

    getData: function (path) {
        var url = this.getDMSUrl("/SDM_API/browser");
        var fullUrl = path ? url + "/" + path : url;

        return $.get({
            url: fullUrl
        });
    },

    setRepoUrl: function () {
        this.getData("")
            .then(response => {
                var repos = Object.keys(response).filter(repo => response[repo].repositoryName == "LIQUIDACIONES");

                var root = repos[0] + "/root";

                var url = this.getDMSUrl("/SDM_API/browser/" + root);

                this._dmsUrl = url;
            });
    },

    onFileTypeError: function(oEvent) {

      var item = oEvent.getParameter("item");

      item.destroy();

      MessageBox.error("El tipo de archivo no es valido.");

    },
 
     handleCancelRetiros: function(oEvent){
      sap.ui.getCore().byId("fechaCabeceraRetiros").setValue("");
      sap.ui.getCore().byId("inputNroLiquidacionRetiros").setValue("");
      sap.ui.getCore().byId("inputTipoCambioRetiros").setValue("");
      sap.ui.getCore().byId("inputTipoComisionRetiros").setValue("");
      sap.ui.getCore().byId("UploadSetLiquidacionesRetiros").removeAllItems();
      sap.ui.getCore().byId("UploadSetComprobantesRetiros").removeAllItems();
      this.oDialogComentRetiros.close();
    },

    handleCancelNegocios: function(oEvent){

      sap.ui.getCore().byId("fechaCabeceraNegocios").setValue("");
      sap.ui.getCore().byId("inputNroLiquidacionNegocios").setValue("");
      sap.ui.getCore().byId("inputTipoComisionNegocios").setValue("");
      sap.ui.getCore().byId("inputTipoCambioNegocios").setValue("");
      sap.ui.getCore().byId("UploadSetLiquidaciones").removeAllItems();
      sap.ui.getCore().byId("UploadSetComprobantes").removeAllItems();
      this.oDialogComentNegocios.close();

    },

    readRepository: function() {
        return $.get({
            url: this._dmsUrl
        });
    },

    onNavAppPend: function()
    {
      var fileName = "Instructivo";
      var dmsURL = this._dmsUrl;
      var that = this;
      this.readRepository().then(result=>{
          var obj = "";
          obj = that.getObjectId(result, fileName);
          var objName = obj.substring(obj.indexOf(" ") + 1);
          var objID = obj.substring(0, obj.lastIndexOf(" "));
          that.downloadFile(dmsURL, objID, objName);
      }
      );
    },


    onOpenTipos: function(oEvent)
    {

    if (!this.oDialogTipoCambio) {

					this.oDialogTipoCambio = sap.ui.xmlfragment("profertil.pendienteDocumentar.view.fragments.tipoCambio", this);
					this.getView().addDependent(this.oDialogTipoCambio);

				}
        var oFilter = sap.ui.getCore().byId("smartFilterBarTipo");
        oFilter.setShowGoButton(false);
				this.oDialogTipoCambio.open();
    },



    getObjectId: function(e, t) {
      for (var i = 0; i < e.objects.length; i++) {
          var o = {};
          o = e.objects[i].object.properties;
          if (o["cmis:name"].value.includes(t)) {
              return o["cmis:objectId"].value + " " + o["cmis:name"].value;
          }
      }
      return "";
  },
  downloadFile: function(e, t, i) {
      var r = e + "?objectId=" + t + "&cmisSelector=content&download=attachment&filename=" + i;
      sap.m.URLHelper.redirect(r, true);
  },
  onBeforeExport: function (oEvt) {
    var mExcelSettings = oEvt.getParameter("exportSettings");
    mExcelSettings.workbook.columns.forEach(function(column) {
      if (column.property == "BstdkE" || column.property == "vencpago")
      {
        column.type = sap.ui.export.EdmType.Date;
        column.width = 10;
        column.inputFormat = "yyyyMMdd";
        if (mExcelSettings.url) {
          return;
        }
      }
    });
  },
  });
});
