var polja = $("input");
function login() {
	// $("#btnRegistracija").prop("disabled", true);
	var greska = 0;
	for(i=0; i<polja.length; i++) {
		var par = polja[i].parentNode;
		if(polja[i].value.length==0){
			greska++;
			par.classList.add("has-error");
		} else {
			par.classList.remove("has-error");
		}
	}
	if(greska>0) {
		return false;
	}

	var username = $("#username").val();
	var password = $("#password").val();
	var korisnik = new Korisnik(username, password);
	var json_korisnik = JSON.stringify(korisnik);
	$.post( "http://obrada.in.rs/kladionica/api/login", json_korisnik, function( data ) {
		console.log(data);
	  	if(data.sifra == 0) {
	  		Swal.fire('Upozorenje', data.poruka, 'error');
	  	} else {
	  		localStorage.setItem("token", data.token);
	  		localStorage.setItem("username", data.korisnik.username);
	  		localStorage.setItem("public", data.korisnik.public);
	  		ocisti();
	  		location.href = "index.php";
	  	}
	});
}

function Korisnik(username, password) {
	this.username = username;
	this.password = password;
}

function ocisti() {
	for(i=0; i<polja.length; i++) {
		polja[i].value = "";
	}
}