var token = localStorage.getItem("token");
var timovi = [];
var utakmice = [];

$(document).ready(function(){
	ucitajTimove();
});
function ucitajTimove() {
	$.getJSON("http://obrada.in.rs/kladionica/api/ucitajTimove/"+token, function(json) {
		$.each(json, function(key, value){
            timovi[value.id]=value.naziv_tima;
            $(".timovi").append('<option value="'+value.id+'">'+value.naziv_tima+'</option>');
            // $("#tim2").append('<option value="'+value.id+'">'+value.naziv_tima+'</option>')
		});
		ucitajUtakmice();
	});
}



function ucitajUtakmice() {
	$.getJSON("http://obrada.in.rs/kladionica/api/ucitajUtakmice/"+token, function(json) {
		$("#dostupne_utakmice tbody").empty();
		$.each(json, function(key, value){
			if(value.rezultat == null) {
				utakmice.push(value);
				$("#dostupne_utakmice tbody").append("<tr><td>"+timovi[value.tim1]+"</td><td>"+timovi[value.tim2]+"</td><td><button class='btn btn-xs btn-primary' onclick='igrajUtakmicu("+value.id+", 1);'>Igraj  <span class='badge'>"+value.kvota1+"</span></button></td><td><button class='btn btn-xs btn-primary' onclick='igrajUtakmicu("+value.id+", 2);'>Igraj  <span class='badge'>"+value.kvota2+"</span></button></td><td><button class='btn btn-xs btn-primary' onclick='igrajUtakmicu("+value.id+", 3);'>Igraj  <span class='badge'>"+value.kvotax+"</span></button></td><td><select class='form-control' onchange='izmeniRezultat(this.value, "+value.id+");'> <option value='' >Izmeni rezultat</option> <option value='1'>1</option> <option value='2'>2</option> <option value='3'>X</option></select></td></tr>");
			}
		});
	});
}

function dodajUtakmicu() {
    var tim1 = $("#tim1").val();
    var tim2 = $("#tim2").val();
    var kvota1 = $("#kvota1").val();
    var kvota2 = $("#kvota2").val();
    var kvotax = $("#kvotax").val();

    if(tim1.length==0 || tim2.length==0 || kvota1.length==0 ||  kvota2.length==0 ||  kvotax.length==0) {
        Swal.fire("Upozorenje", "Popunite sva polja!", "error");
    } else {
        var utakmica = {}
        utakmica['tim1'] = tim1;
        utakmica['tim2'] = tim2;
        utakmica['kvota1'] = kvota1;
        utakmica['kvota2'] = kvota2;
        utakmica['kvotax'] = kvotax;

        var json_utakmica = JSON.stringify(utakmica);


        $.post("http://obrada.in.rs/kladionica/api/dodajUtakmicu/"+token, json_utakmica, function(json) {
            if(json.sifra == 1) {
                Swal.fire("Info!", json.poruka, "success");
                ucitajUtakmice();
            } else {
                Swal.fire("Upozorenje", json.poruka, "error");
            }
        });
    }
}

function izmeniRezultat(rezultat, utakmica_id) {
    $.getJSON("http://obrada.in.rs/kladionica/api/izmeniRezultat/"+token+"/"+utakmica_id+"/"+rezultat, function(json){
        if(json.sifra == 1) {
            Swal.fire("Info!", json.poruka, "success");
            ucitajUtakmice();
        } else {
            Swal.fire("Upozorenje", json.poruka, "error");
        }
    })
}