
$(document).ready(function () {
   $('.leftContent').css('height',$(window).height())
   $('.rightContent').css('height',$(window).height())
});




function login(){

    var emailId = $.trim($("#username").val());
    var password = $.trim($("#password").val());

    $("#submitButton").attr('disabled','disabled');

    loginCall(emailId.toLowerCase(), password,function (status, data) {

        $("#submitButton").removeAttr('disabled');
        console.log(status);
        console.log(data);
        if(status){
            Cookies.set('session_obj', data);
            document.location = '/wash-management';

        }else{
            swal("Authentication Failed", "Incorrect Username/Password!", "danger");

        }
    })
}