// =============================================
// COULEURS DU THÈME PERROQUET
// =============================================
var NOIR_FOND    = "#1a1208";
var NOIR_PROFOND = "#0d0d0d";
var OR_PRINCIPAL = "#c9982e";
var OR_CLAIR     = "#e8c547";
var OR_FONCE     = "#8b6914";
var CREME        = "#f0e6d0";
var OR_SUBTIL    = "#2a2010";
var BLANC        = "#ffffff";

// =============================================
// Fonction GET — reçoit les données du formulaire ou stats
// =============================================
function doGet(e) {
  try {
    if (!e || !e.parameter) {
      return ContentService
        .createTextOutput("Error: No parameters received")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = "RESERVATION PERROQUET";
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      setupHeaders(sheet);
    }

    // Si on demande les statistiques pour le dashboard admin
    if (e.parameter.action === "getStats") {
      var stats = getDashboardStats(sheet);
      var admins = getAdmins(ss); // Fetch dynamic admin access from the spreadsheet
      
      // Retour JSONP (compatible avec jQuery ajax type 'jsonp' ou fetch jsonp)
      // Si la requête vient d'un fetch() classique qui suit les redirections, 
      // parfois JSON simple marche sur Google Script, 
      // MAIS pour éviter tout souci CORS on va faire un retour basique JSON
      // Google handle CORS auto si le fetch mode est "cors" et pas restrictif.
      // Cependant on voit une erreur dans la console, donc on va privilégier le JSON classique *SI* le callback n'est pas fourni.
      var result = { status: "success", stats: stats, admins: admins };
      if (e.parameter.callback) {
         return ContentService.createTextOutput(e.parameter.callback + "(" + JSON.stringify(result) + ")")
           .setMimeType(ContentService.MimeType.JAVASCRIPT);
      } else {
         return ContentService.createTextOutput(JSON.stringify(result))
           .setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Sinon, c'est une soumission de formulaire
    // Récupérer la date de soirée ou "Non spécifiée"
    var dateSoiree = e.parameter.dateSoiree || "Non spécifiée";

    // Chercher ou créer la section pour cette soirée
    var insertRow = findOrCreateSoireeSection(sheet, dateSoiree);

    // Insérer la nouvelle ligne de données
    sheet.insertRowAfter(insertRow);
    var newRow = insertRow + 1;

    sheet.getRange(newRow, 1).setValue(e.parameter.nom || "");
    sheet.getRange(newRow, 2).setValue(e.parameter.prenom || "");
    sheet.getRange(newRow, 3).setValue(e.parameter.whatsapp || "");
    sheet.getRange(newRow, 4).setValue(e.parameter.telephone || "");
    sheet.getRange(newRow, 5).setValue(e.parameter.activites || "");
    sheet.getRange(newRow, 6).setValue(e.parameter.positionnement || "");
    sheet.getRange(newRow, 7).setValue(new Date());

    // Formater la nouvelle ligne
    formatDataRow(sheet, newRow);

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
// SETUP DES EN-TÊTES
// =============================================
function setupHeaders(sheet) {
  var lastCol = 7;

  // Ligne 1 : Titre
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

  // Figer la première ligne
  sheet.setFrozenRows(1);

  // Largeur des colonnes
  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 140);
  sheet.setColumnWidth(3, 200);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 160);
  sheet.setColumnWidth(7, 180);
}

// =============================================
// TROUVER OU CRÉER UNE SECTION SOIRÉE
// =============================================
function findOrCreateSoireeSection(sheet, dateSoiree) {
  var lastRow = sheet.getLastRow();
  var label = "📅 SOIRÉE DU " + dateSoiree.toUpperCase();

  // Chercher si la section existe déjà
  for (var i = 2; i <= lastRow; i++) {
    var cellValue = sheet.getRange(i, 1).getValue();
    if (cellValue.toString().indexOf("SOIRÉE DU") !== -1 && cellValue.toString().indexOf(dateSoiree.toUpperCase()) !== -1) {
      // Trouver la dernière ligne de données de cette section
      var lastDataRow = i + 1; // Au moins la ligne d'en-tête de colonnes
      for (var j = i + 2; j <= lastRow; j++) {
        var nextCell = sheet.getRange(j, 1).getValue().toString();
        if (nextCell.indexOf("SOIRÉE DU") !== -1 || nextCell === "") {
          break;
        }
        lastDataRow = j;
      }
      return lastDataRow;
    }
  }

  // La section n'existe pas → la créer
  var insertAt = lastRow + 2; // Laisser une ligne vide

  // Ligne séparateur avec le nom de la soirée
  var sectionRow = sheet.getRange(insertAt, 1, 1, 7);
  sectionRow.merge();
  sectionRow.setValue(label);
  sectionRow.setBackground(OR_FONCE);
  sectionRow.setFontColor(BLANC);
  sectionRow.setFontFamily("Georgia");
  sectionRow.setFontSize(13);
  sectionRow.setFontWeight("bold");
  sectionRow.setHorizontalAlignment("center");
  sectionRow.setVerticalAlignment("middle");
  sheet.setRowHeight(insertAt, 40);
  sectionRow.setBorder(true, true, true, true, false, false, OR_PRINCIPAL, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // Ligne en-têtes de colonnes
  var headerRow = insertAt + 1;
  var headers = ["Nom", "Prénom", "WhatsApp", "Téléphone", "Activités", "Position", "Date Inscription"];
  var headerRange = sheet.getRange(headerRow, 1, 1, 7);
  headerRange.setValues([headers]);
  headerRange.setBackground("#3d2e10");
  headerRange.setFontColor(OR_CLAIR);
  headerRange.setFontFamily("Arial");
  headerRange.setFontSize(10);
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(headerRow, 32);
  headerRange.setBorder(true, true, true, true, true, true, OR_PRINCIPAL, SpreadsheetApp.BorderStyle.SOLID);

  return headerRow;
}

// =============================================
// FORMATER UNE LIGNE DE DONNÉES
// =============================================
function formatDataRow(sheet, rowNum) {
  var row = sheet.getRange(rowNum, 1, 1, 7);
  row.setFontFamily("Arial");
  row.setFontSize(10);
  row.setVerticalAlignment("middle");
  row.setHorizontalAlignment("center");
  sheet.setRowHeight(rowNum, 30);

  // Alternance de couleurs
  if (rowNum % 2 === 0) {
    row.setBackground(NOIR_FOND);
  } else {
    row.setBackground(OR_SUBTIL);
  }
  row.setFontColor(CREME);

  // Bordure fine en bas
  row.setBorder(false, false, true, false, false, false, "#3d3019", SpreadsheetApp.BorderStyle.SOLID);

  // Format date colonne G
  sheet.getRange(rowNum, 7).setNumberFormat("dd/MM/yyyy HH:mm");
}

// =============================================
// MISE EN FORME INITIALE COMPLÈTE
// (à exécuter une seule fois pour tout remettre en forme)
// =============================================
function formatSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("RESERVATION PERROQUET");

  if (!sheet) {
    Logger.log("Feuille RESERVATION PERROQUET introuvable.");
    return;
  }

  var lastRow = sheet.getLastRow();
  var lastCol = 7;

  // Setup titre et colonnes
  setupHeaders(sheet);

  // Récupérer toutes les données existantes (à partir de la ligne 2)
  if (lastRow < 2) return;

  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  // Effacer tout sauf le titre
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clear();
    // Supprimer les lignes fusionnées
    for (var i = lastRow; i >= 2; i--) {
      try { sheet.getRange(i, 1, 1, lastCol).breakApart(); } catch(e) {}
    }
  }

  // Trier les données par date de soirée (si existante) ou par date d'inscription
  // Pour l'instant, regrouper toutes les données existantes dans "Inscriptions existantes"
  var currentRow = 2;

  // Créer une section pour les données existantes
  var sectionRow = sheet.getRange(currentRow, 1, 1, 7);
  sectionRow.merge();
  sectionRow.setValue("📅 INSCRIPTIONS EXISTANTES");
  sectionRow.setBackground(OR_FONCE);
  sectionRow.setFontColor(BLANC);
  sectionRow.setFontFamily("Georgia");
  sectionRow.setFontSize(13);
  sectionRow.setFontWeight("bold");
  sectionRow.setHorizontalAlignment("center");
  sectionRow.setVerticalAlignment("middle");
  sheet.setRowHeight(currentRow, 40);
  sectionRow.setBorder(true, true, true, true, false, false, OR_PRINCIPAL, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  currentRow++;

  // En-têtes de colonnes
  var headers = ["Nom", "Prénom", "WhatsApp", "Téléphone", "Activités", "Position", "Date Inscription"];
  var headerRange = sheet.getRange(currentRow, 1, 1, 7);
  headerRange.setValues([headers]);
  headerRange.setBackground("#3d2e10");
  headerRange.setFontColor(OR_CLAIR);
  headerRange.setFontFamily("Arial");
  headerRange.setFontSize(10);
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(currentRow, 32);
  headerRange.setBorder(true, true, true, true, true, true, OR_PRINCIPAL, SpreadsheetApp.BorderStyle.SOLID);

  currentRow++;

  // Insérer les données existantes (ignorer les lignes vides et les anciennes en-têtes)
  for (var i = 0; i < data.length; i++) {
    var nom = data[i][0].toString().trim();
    // Ignorer les lignes vides, l'ancien titre, et les anciennes en-têtes
    if (nom === "" || nom.indexOf("RESERVATION") !== -1 || nom === "Nom" || nom.indexOf("SOIRÉE") !== -1 || nom.indexOf("INSCRIPTIONS") !== -1) continue;

    sheet.getRange(currentRow, 1, 1, 7).setValues([data[i]]);
    formatDataRow(sheet, currentRow);
    currentRow++;
  }

  Logger.log("✅ Mise en forme Perroquet appliquée avec succès !");
}

// =============================================
// STATISTIQUES POUR LE DASHBOARD ADMIN
// =============================================
function getDashboardStats(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return {};

  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  var stats = {
    "_TOTAL_": { total: 0, leader: 0, follower: 0 }
  };
  var currentSoiree = "";

  for (var i = 0; i < data.length; i++) {
    var nom = data[i][0] ? data[i][0].toString().trim() : "";
    
    // Détecter un séparateur de soirée
    if (nom.indexOf("SOIRÉE DU") !== -1) {
      // Extraire la date "DD/MM/YYYY" de "📅 SOIRÉE DU DD/MM/YYYY"
      var parts = nom.split("SOIRÉE DU");
      if (parts.length > 1) {
        currentSoiree = parts[1].trim();
        if (!stats[currentSoiree]) {
          stats[currentSoiree] = { total: 0, leader: 0, follower: 0 };
        }
      }
      continue;
    }
    
    // Ignorer les autres lignes "spéciales", ou vides
    if (nom === "" || nom.indexOf("RESERVATION") !== -1 || nom === "Nom" || nom.indexOf("INSCRIPTIONS") !== -1) continue;

    // Si on a une ligne de données valide
    stats["_TOTAL_"].total++;
    var position = data[i][5] ? data[i][5].toString().trim().toUpperCase() : "";
    
    if (position === "LEADER") {
      stats["_TOTAL_"].leader++;
    } else if (position === "FOLLOWER") {
      stats["_TOTAL_"].follower++;
    }

    if (currentSoiree && stats[currentSoiree]) {
      stats[currentSoiree].total++;
      if (position === "LEADER") {
        stats[currentSoiree].leader++;
      } else if (position === "FOLLOWER") {
        stats[currentSoiree].follower++;
      }
    }
  }

  return stats;
}

// =============================================
// GESTION DYNAMIQUE DES ACCES ADMIN
// =============================================
function getAdmins(ss) {
  var sheetName = "ADMINS ACCES";
  var sheet = ss.getSheetByName(sheetName);
  var defaultAdmins = {
    '0650178078': '7291',
    '0766281613': '4538',
    '0782832500': '6174',
    '0667466669': '3826'
  };
  
  // Si l'onglet n'existe pas, on le crée et on insère les codes par défaut
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    var headers = ["TÉLÉPHONE", "CODE PIN SECRÈT", "NOM DU MEMBRE"];
    sheet.getRange(1, 1, 1, 3).setValues([headers]);
    sheet.getRange(2, 1, 4, 3).setValues([
      ["0650178078", "7291", "JOHNNY GERMAIN"],
      ["0766281613", "4538", "ERWAN"],
      ["0782832500", "6174", "BEMOUSS"],
      ["0667466669", "3826", "MELANIE"]
    ]);
    
    // Style de la ligne d'en-tête
    sheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#c9982e").setFontColor("#000000");
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 130);
    sheet.setColumnWidth(3, 200);
    
    return defaultAdmins;
  }
  
  // S'il existe, on lit tous les codes disponibles pour ajouter de nouveaux membres
  var lastRow = sheet.getLastRow();
  var admins = {};
  if (lastRow > 1) {
    var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    for (var i = 0; i < data.length; i++) {
       var phone = data[i][0].toString().trim().replace(/\s/g, '');
       // Si le tableur a supprimé le '0' initial (transformant le texte en nombre)
       if (phone.length === 9 && !phone.startsWith('0')) {
           phone = '0' + phone;
       }
       
       var pin = data[i][1].toString().trim();
       if (phone && pin) {
         admins[phone] = pin;
       }
    }
  }
  
  // Securité : S'il est vide pour une raison quelconque, ramener les valeurs par defaut
  return Object.keys(admins).length > 0 ? admins : defaultAdmins;
}
