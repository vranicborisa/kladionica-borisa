var token = localStorage.getItem("token");
var timovi = [];
var utakmice = [];
var tiketi = [];
$(document).ready(function () {
	ucitajTimove();
});
function ucitajTimove() {
	$.getJSON("http://obrada.in.rs/kladionica/api/ucitajTimove/" + token, function (json) {
		$.each(json, function (key, value) {
			// console.log(value);
			timovi[value.id] = value.naziv_tima;
		});
		ucitajUtakmice();
	});
}

function findById(id) {
	var result = utakmice.filter(obj => {
		return obj.id == id;
	});
	return result;
}

function findByTiketId(id) {
	var result = tiketi.filter(obj => {
		return obj.tiket_id == id;
	});
	return result;
}

function ucitajUtakmice() {
	$.getJSON("http://obrada.in.rs/kladionica/api/ucitajUtakmice/" + token, function (json) {
		$("#dostupne_utakmice tbody").empty();
		$.each(json, function (key, value) {
			utakmice.push(value);
			$("#dostupne_utakmice tbody").append("<tr><td>" + timovi[value.tim1] + "</td><td>" + timovi[value.tim2] + "</td><td><button class='btn btn-xs btn-primary' onclick='igrajUtakmicu(" + value.id + ", 1);'>Igraj  <span class='badge'>" + value.kvota1 + "</span></button></td><td><button class='btn btn-xs btn-primary' onclick='igrajUtakmicu(" + value.id + ", 2);'>Igraj  <span class='badge'>" + value.kvota2 + "</span></button></td><td><button class='btn btn-xs btn-primary' onclick='igrajUtakmicu(" + value.id + ", 3);'>Igraj  <span class='badge'>" + value.kvotax + "</span></button></td></tr>");
		console.log(json[7]);
			
		});
	});
}
function ucitajTikete() {
	$.getJSON("http://obrada.in.rs/kladionica/api/ucitajTikete/" + token, function (json) {
		
		$("#tiketi").empty();
	// 	var utakmice_u_igri = 0;
	// var promasaj = 0;
	// var pogodak = 0;
		$.each(json, function (key, value) {
			tiketi.push(value);
			var broj_odigranih_utakmica = value.parovi.length;
			var uplata = value.uplata;
			var datum_i_vreme_uplate = value.vreme_uplate;
			
			$("#tiketi").append('<div class="well text-center"> <h2>Tiket ID: ' + value.tiket_id + '</h2> <div class="row"> <div class="col-lg-6 col-xs-12"> <p>Broj odigranih utakmica: <span id="odigrane_utakmice">' + broj_odigranih_utakmica + '</span></p> <p>Uplata: <span id="">' + uplata + ' RSD</span></p> <p>Datum i vreme uplate: <span id="datum_i_vreme_uplate">' + datum_i_vreme_uplate + '</span></p> </div> <div class="col-lg-6 col-xs-12"> <div class="alert alert-info"><span id="aktivnostTiketa">Tiket je aktivan</span></div> <button class="btn btn-primary btn-block" onclick="otvoriModal(' + value.tiket_id + ')">Detalji</button> </div> </div> </div>');
		});
		// if (utakmice_u_igri > 0) {
		// 		$("#aktivnostTiketa").html("Tiket je aktivan.");
		// 		$("#aktivnostTiketa").removeClass("zelenaBoja");
		// 		$("#aktivnostTiketa").removeClass("crvenaBoja");
		// 		$("#aktivnostTiketa").addClass("plavaBoja");
		// 	} else if (promasaj > 0) {
		// 		$("#aktivnostTiketa").html("Tiket je Gubitan");
		// 		$("#aktivnostTiketa").removeClass("plavaBoja");
		// 		$("#aktivnostTiketa").removeClass("zelenaBoja");
		// 		$("#aktivnostTiketa").addClass("crvenaBoja");
		
		// 	} else {
		// 		$("#aktivnostTiketa").html("Tiket je dobitan.");
		// 		$("#aktivnostTiketa").removeClass("plavaBoja");
		// 		$("#aktivnostTiketa").removeClass("crvenaBoja");
		// 		$("#aktivnostTiketa").addClass("zelenaBoja");
		// 	}
		$("#ukupno_tiketa").html(json.length);
		// $(".div.alert.alert-info").html(json.length);

		console.log(json);
		
	});
}

function otvoriModal(tiket_id) {
	$("#myModal").modal("show");
	var tiket = findByTiketId(tiket_id);
	$("#uplata").html(tiket[0].uplata + " RSD");
	$("table tbody").empty();
	var ukupna_kvota = 1;
	var utakmice_u_igri = 0;
	var promasaj = 0;
	var pogodak = 0;
	$.each(tiket[0].parovi, function (key, value) {
		console.log(tiket[0].parovi);
		var utakmica = findById(value.utakmica_id);
		// console.log(utakmica[0].rezultat.length);
		if (utakmica[0].rezultat == null) {
			utakmice_u_igri++;
		} else {
			if (utakmica[0].rezultat == value.igra) {
				pogodak++;
			} else {
				promasaj++;
			}
		}
		if (value.igra == 3) {
			var tip_za_tabelu = "X";
		} else {
			var tip_za_tabelu = value.igra;
		}
		switch (+value.igra) {
			case 1:
				var kvota = utakmica[0].kvota1;
				break;
			case 2:
				var kvota = utakmica[0].kvota2;
				break;
			case 3:
				var kvota = utakmica[0].kvotax;
				break;
			default:
				var kvota = "Greska";
		}
		ukupna_kvota *= parseFloat(kvota);
		$("#ukupna_kvota").html(Math.round(ukupna_kvota * 100) / 100);
		$("#potencijalna_isplata").html(Math.round(ukupna_kvota * tiket[0].uplata * 100) / 100 + " RSD");
		$("table tbody").append('<tr id="redUModalu"><td>' + timovi[utakmica[0].tim1] + '</td><td>' + timovi[utakmica[0].tim2] + '</td><td>' + tip_za_tabelu + '</td><td>' + kvota + '</td></tr>');
	});
	if (utakmice_u_igri > 0) {
		$("#status_tiketa").html("AKTIVAN");
		$("#status_tiketa").removeClass("zelenaBoja");
		$("#status_tiketa").removeClass("crvenaBoja");
		$("#status_tiketa").addClass("plavaBoja");

		$("table tbody tr").addClass("plavaBoja");
	} else if (promasaj > 0) {
		$("#status_tiketa").html("GUBITAN");
		$("#status_tiketa").removeClass("plavaBoja");
		$("#status_tiketa").removeClass("zelenaBoja");
		$("#status_tiketa").addClass("crvenaBoja");

		$("table tbody tr").addClass("crvenaBoja");
	} else {
		$("#status_tiketa").html("DOBITAN");
		$("#status_tiketa").removeClass("plavaBoja");
		$("#status_tiketa").removeClass("crvenaBoja");
		$("#status_tiketa").addClass("zelenaBoja");
		$("table tbody tr").addClass("zelenaBoja");
	}

	
}