/**
 * Created by WIN10 on 18.07.2017.
 */

var paneldurum = false;
function  panelAcKapat() {
    if(paneldurum==false){
        paneldurum=true;
        $("#panelonoff").attr("style","position: fixed; left: 5px; bottom: 405px;");
        $("#panelAcKapatButon").html('<span class="glyphicon glyphicon-circle-arrow-down" aria-hidden="true"></span>');
        $("#panel").css("bottom","0px");
    }else{
        paneldurum=false;
        $("#panelonoff").attr("style","position: fixed; left: 5px; bottom: 59px;");
        $("#panelAcKapatButon").html('<span class="glyphicon glyphicon-circle-arrow-up" aria-hidden="true"></span>');
        $("#panel").css("bottom","-348px");
    }
}