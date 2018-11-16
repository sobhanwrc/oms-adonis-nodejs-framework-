
$('#login_submit').on('click', function () {
    var valid = $('#login_form').valid();
    if(valid) {
        $('#login_form').submit();
    }
});

$('#login_form').validate({
    rules:{
        username:{
            required : true
        },
        password : {
            required : true
        }
    },
    messages:{
        username:{
            required : "<font color='red'>Please enter your username.</font>"
        },
        password : {
            required : "<font color='red'>Please enter your valid password.</font>"
        }
    }
});