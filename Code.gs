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
      formatSheet(); // Formater automatiquement à la création
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

// =============================================
// MISE EN FORME DU GOOGLE SHEET
// Thème Perroquet : Noir & Or
// =============================================
function formatSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("RESERVATION PERROQUET");

  if (!sheet) {
    Logger.log("Feuille RESERVATION PERROQUET introuvable.");
    return;
  }

  // ─── COULEURS DU THÈME PERROQUET ───
  var NOIR_FOND      = "#1a1208";   // Fond sombre (brun-noir)
  var NOIR_PROFOND   = "#0d0d0d";   // Noir profond
  var OR_PRINCIPAL   = "#c9982e";   // Or principal
  var OR_CLAIR       = "#e8c547";   // Or clair
  var OR_FONCE       = "#8b6914";   // Or foncé
  var CREME          = "#f0e6d0";   // Crème pour texte
  var OR_SUBTIL      = "#2a2010";   // Or subtil pour rayures
  var BLANC          = "#ffffff";

  // ─── DIMENSIONS ───
  var lastCol = 7; // A à G
  var lastRow = Math.max(sheet.getLastRow(), 2);
  var dataRange = sheet.getRange(1, 1, lastRow, lastCol);

  // ─── LARGEUR DES COLONNES ───
  sheet.setColumnWidth(1, 160);  // Nom
  sheet.setColumnWidth(2, 140);  // Prénom
  sheet.setColumnWidth(3, 200);  // Déjà Inscrit WhatsApp
  sheet.setColumnWidth(4, 150);  // Téléphone
  sheet.setColumnWidth(5, 140);  // Activités
  sheet.setColumnWidth(6, 160);  // Positionnement
  sheet.setColumnWidth(7, 180);  // Date

  // ─── LIGNE 1 : TITRE / BANDEAU ───
  var titleRow = sheet.getRange(1, 1, 1, lastCol);
  titleRow.merge();
  titleRow.setValue("🦜  RESERVATION PERROQUET  🦜");
  titleRow.setBackground(NOIR_PROFOND);
  titleRow.setFontColor(OR_PRINCIPAL);
  titleRow.setFontFamily("Georgia");
  titleRow.setFontSize(16);
  titleRow.setFontWeight("bold");
  titleRow.setHorizontalAlignment("center");
  titleRow.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 50);

  // ─── LIGNE 2 : EN-TÊTES ───
  var headers = ["Nom", "Prénom", "Déjà Inscrit sur Whatsapp", "Téléphone", "Activités", "Positionnement", "Date"];
  var headerRow = sheet.getRange(2, 1, 1, lastCol);
  headerRow.setValues([headers]);
  headerRow.setBackground(OR_FONCE);
  headerRow.setFontColor(BLANC);
  headerRow.setFontFamily("Arial");
  headerRow.setFontSize(11);
  headerRow.setFontWeight("bold");
  headerRow.setHorizontalAlignment("center");
  headerRow.setVerticalAlignment("middle");
  sheet.setRowHeight(2, 38);

  // ─── BORDURES EN-TÊTES ───
  headerRow.setBorder(true, true, true, true, true, true, OR_PRINCIPAL, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // ─── FOND DES DONNÉES (ligne 3+) ───
  if (lastRow > 2) {
    var dataRows = sheet.getRange(3, 1, lastRow - 2, lastCol);
    dataRows.setFontFamily("Arial");
    dataRows.setFontSize(10);
    dataRows.setVerticalAlignment("middle");
    dataRows.setHorizontalAlignment("center");

    // Rayures alternées noir/or subtil
    for (var i = 3; i <= lastRow; i++) {
      var row = sheet.getRange(i, 1, 1, lastCol);
      if (i % 2 === 1) {
        row.setBackground(NOIR_FOND);
        row.setFontColor(CREME);
      } else {
        row.setBackground(OR_SUBTIL);
        row.setFontColor(CREME);
      }
      row.setBorder(false, false, true, false, false, false, "#3d3019", SpreadsheetApp.BorderStyle.SOLID);
      sheet.setRowHeight(i, 30);
    }
  }

  // ─── FIGER LES 2 PREMIÈRES LIGNES ───
  sheet.setFrozenRows(2);

  // ─── FORMAT DATE COLONNE G ───
  var dateCol = sheet.getRange(3, 7, Math.max(lastRow - 2, 1), 1);
  dateCol.setNumberFormat("dd/MM/yyyy HH:mm");

  // ─── BORDURE EXTÉRIEURE DU TABLEAU ───
  var fullTable = sheet.getRange(1, 1, lastRow, lastCol);
  fullTable.setBorder(true, true, true, true, false, false, OR_PRINCIPAL, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // ─── PROTÉGER L'EN-TÊTE ───
  var protection = sheet.getRange(1, 1, 2, lastCol).protect();
  protection.setDescription("En-tête protégé");
  protection.setWarningOnly(true);

  Logger.log("✅ Mise en forme Perroquet appliquée avec succès !");
}
