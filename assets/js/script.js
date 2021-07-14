$(function () {
    $('#buscar').click(e => {
        buscarPersonaje();
    });

    $("#limpiar").click(e => {
        limpiar();
    })


    $(document).keypress(e => {
        if (e.which == 13) {
            buscarPersonaje();
        }
    })
});


function buscarPersonaje() {
    var id_personaje = $("#input_busqueda").val();
    //guardia
    if (validacion(id_personaje) == false) {
        errorInput();
        return;
    }
    //getPersonaje
    getPersonaje(id_personaje);

}

function validacion(id) {
    var expresion = /^\d{1,3}$/;

    if (expresion.test(id)) {
        return true;
    }
    return false;
}

function errorInput() {
    alert("Input invalido");
    $("#input_busqueda").focus();
}

function limpiar() {
    $("#heroInfo").empty();
    $("#stats").empty();
    $("#input_search").focus();
}

function getPersonaje(id) {
    $.ajax({
        type: "GET",
        url: `https://superheroapi.com/api.php/515482882977049/${id}`,
        success: function (personaje) {
            console.log(personaje.name);
            console.log(personaje.image);
            console.log(personaje.biography);
            console.log(personaje.appearance);
            console.log(personaje.work);
            console.log(personaje.connections);
            console.log(personaje.powerstats);
            $("#heroInfo").empty();
            $('#heroInfo').append(generarCard(personaje));
            generarGrafico(personaje);
        }
    });
}

function generarCard(personaje) {
    var card = `
    <h2>SuperHero Encontrado</h2>
    <div class="card mb-3" style="max-width: 540px;">       
         <div class="row no-gutters">
                <div class="col md-4">
                     <img src="${personaje.image.url}" class="card-img-top" alt="...">
                </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title"> Nombre: ${personaje.name}</h5>
                    <div> Publicado por: ${personaje.biography.publisher}</div>
                    <hr>
                    <div> Ocupación: ${personaje.work.occupation} </div>
                    <hr> 
                    <div> Primera Aparición: ${personaje.biography["first-appearance"]}</div>
                    <hr>
                    <div> Altura: ${personaje.appearance.height.join("-")}</div>
                    <hr>
                    <div> Peso: ${personaje.appearance.weight.join("-")}</div>
                    <hr>
                    <div> Alianzas: ${personaje.connections["group-affiliation"]}</div>
                
            </div>
            </div>
        </div>
    </div>`;

    return card;
}

function generarGrafico(personaje) {
    var arrayPuntos = personajeGrafico(personaje);
    console.log(arrayPuntos)
    var chart = new CanvasJS.Chart("stats", {
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: `Estadísticas de poder para (${personaje.name})`
        },
        data: [{
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            indexLabelFontSize: 16,
            indexLabel: "{label} - {y}%",
            dataPoints: arrayPuntos,
        }]
    });
    chart.render();
    
}

function personajeGrafico(personaje){
    var powerstats = personaje.powerstats
    var nuevoObjeto = [
        
    ];
    for (const key in powerstats) {
        var datos = {};
        datos.label = key
        datos.y = (powerstats[key] == "null")?0:parseInt(powerstats[key]);
        nuevoObjeto.push(datos)
    }

    return nuevoObjeto
}




// //<div> Primera Aparición: ${personaje.biography.first-appearance}</div> (así no van...ver la nomenclatura de la linea 73)
// <div> Alianzas: ${personaje.connections.group-affiliation}</div> (ver la nomenclatura de la linea 79)
