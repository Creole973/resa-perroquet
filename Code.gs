// Fonction GET — reçoit les données via paramètres URL (méthode sans CORS)
function doGet(e) {
  try {
    if (!e || !e.parameter) {
      return ContentService
        .createTextOutput("Error: No parameters received")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("RESERVATION PERROQUET");

    if (!sheet) {
      // Créer la feuille si elle n'existe pas encore
      sheet = ss.insertSheet("RESERVATION PERROQUET");
      sheet.appendRow(["Nom", "Prénom", "Déjà Inscrit sur Whatsapp", "Téléphone", "Activités", "Positionnement", "Date"]);
    }

    sheet.appendRow([
      e.parameter.nom         || "",
      e.parameter.prenom      || "",
      e.parameter.whatsapp    || "",
      e.parameter.telephone   || "",
      e.parameter.activites   || "",
      e.parameter.positionnement || "",
      new Date()
    ]);

    return ContentService
      .createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    Logger.log(error);
    return ContentService
      .createTextOutput("Error: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
